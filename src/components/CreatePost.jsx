import { useState, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BiImageAdd, BiVideoPlus, BiSmile } from 'react-icons/bi';
import EmojiPicker from 'emoji-picker-react';
import '../styles/CreatePost.css';

function CreatePost({ user, onPostCreated }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    try {
      let mediaUrl = '';
      if (media) {
        const storageRef = ref(storage, `posts/${Date.now()}_${media.name}`);
        await uploadBytes(storageRef, media);
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        content,
        mediaUrl,
        mediaType: media?.type.includes('image') ? 'image' : 'video',
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        tags: []
      });

      setContent('');
      setMedia(null);
      setMediaPreview('');
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-info">
          <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
          <span className="user-name">{user.displayName}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-input"
          placeholder="What's on your mind?"
          maxLength={280}
        />
        
        {mediaPreview && (
          <div className="media-preview">
            {media?.type.includes('image') ? (
              <img src={mediaPreview} alt="Preview" />
            ) : (
              <video src={mediaPreview} controls />
            )}
            <button 
              type="button" 
              className="remove-media"
              onClick={() => {
                setMedia(null);
                setMediaPreview('');
              }}
            >
              ×
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <div className="media-upload">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="media-upload-button"
              onClick={() => fileInputRef.current.click()}
            >
              <BiImageAdd className="button-icon" />
              <span className="button-text">Media</span>
            </button>
            <div className="emoji-picker-container" ref={emojiButtonRef}>
              <button 
                type="button" 
                className="media-upload-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <BiSmile className="button-icon" />
                <span className="button-text">Emoji</span>
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker-wrapper">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                  />
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            className={`post-button ${!content.trim() && !media ? 'disabled' : ''}`}
            disabled={!content.trim() && !media}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost; 