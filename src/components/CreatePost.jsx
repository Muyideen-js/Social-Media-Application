import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { IoImageOutline, IoHappyOutline } from 'react-icons/io5';
import { RiUserLine, RiUserFollowLine, RiUserHeartLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import CustomAlert from './CustomAlert';
import '../styles/CreatePost.css';

function CreatePost({ user, onTabChange }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('you');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab); // Pass the active tab to parent component
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const postData = {
        userId: user.uid,
        authorId: user.uid,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        postType: activeTab
      };

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

  return (
    <>
      <div className="post-tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'you' ? 'active' : ''}`}
          onClick={() => handleTabChange('you')}
        >
          <RiUserLine />
          <span>For You</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabChange('following')}
        >
          <RiUserFollowLine />
          <span>Following</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => handleTabChange('followers')}
        >
          <RiUserHeartLine />
          <span>Followers</span>
        </button>
      </div>

      <div className="create-post">
        <div className="create-post-header">
          <img 
            src={user?.photoURL} 
            alt={user?.displayName} 
            className="user-avatar"
          />
          <span className="user-name">{user?.displayName}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="post-input-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user?.displayName?.split(' ')[0]}?`}
              className="post-input"
            />
          </div>

          <div className="post-actions">
            <div className="post-tools">
              <button 
                type="button"
                className="tool-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <IoHappyOutline />
                <span className="tooltip">Add emoji</span>
              </button>

              <button 
                type="button"
                className="tool-btn disabled"
                title="Media uploads require Firebase Storage (paid plan)"
              >
                <IoImageOutline />
                <span className="tooltip">Media upload (coming soon)</span>
              </button>
            </div>

            <button 
              type="submit" 
              className="post-btn"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>

          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme="dark"
                width="100%"
                height={400}
              />
            </div>
          )}
        </form>
      </div>

      {showAlert && (
        <CustomAlert
          message="Post created successfully! 🎉"
          type="success"
          onClose={() => setShowAlert(false)}
          duration={3000}
        />
      )}
    </>
  );
}

export default CreatePost; 