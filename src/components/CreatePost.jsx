import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { IoImageOutline, IoHappyOutline, IoClose, IoSendOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { RiUserLine, RiUserFollowLine, RiUserHeartLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import CustomAlert from './CustomAlert';
import '../styles/CreatePost.css';

function CreatePost({ user, onTabChange }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('foryou');
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab); // Pass the active tab to parent component
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const postData = {
        userId: userId,
        authorId: userId,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        authorName: auth.currentUser.displayName,
        authorPhoto: auth.currentUser.photoURL,
        postType: activeTab,
        userVerified: userData?.verified || false,
        verificationType: userData?.verificationType || 'user'
      };

      console.log('Creating post with verification:', postData);
      
      await addDoc(collection(db, 'posts'), postData);
      setContent('');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setContent(prevContent => prevContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaPreview(null);
  };

  const tabs = [
    { id: 'foryou', label: 'For You' },
    { id: 'following', label: 'Following' },
    { id: 'followers', label: 'Followers' }
  ];

  return (
    <div className="create-post">
      <div className="post-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="post-input-container">
        <textarea
          className="post-input"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
        
        {mediaPreview && (
          <div className="media-preview">
            <img src={mediaPreview} alt="Upload preview" />
            <button className="remove-media" onClick={handleRemoveMedia}>
              <IoClose />
            </button>
          </div>
        )}
      </div>

      <div className="post-actions">
        <div className="post-tools">
          <div className="emoji-picker-container">
            <button 
              className="tool-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <IoHappyOutline />
              <span className="tooltip">Add emoji</span>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <EmojiPicker onEmojiSelect={onEmojiClick} />
              </div>
            )}
          </div>

          <div className="media-upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaUpload}
              className="media-upload-input"
              id="media-upload"
            />
            <label htmlFor="media-upload" className="tool-button">
              <IoImageOutline />
              <span className="tooltip">Add photo</span>
            </label>
          </div>
        </div>

        <div className="post-button-container">
          <span className={`char-counter ${
            content.length > 240 ? 'warning' : ''
          } ${content.length > 270 ? 'error' : ''}`}>
            {content.length}/280
          </span>
          
          <button 
            className={`post-button ${isLoading ? 'loading' : ''}`}
            disabled={!content.trim() || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Posting...' : 'Post'}
            {!isLoading && <IoSendOutline />}
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="custom-toast">
          <div className="toast-content">
            <IoCheckmarkCircle className="toast-icon" />
            <span>Post created successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePost; 