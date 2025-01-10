import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, collection, serverTimestamp, getDoc, increment } from 'firebase/firestore';
import { FaTrash, FaHeart, FaRegHeart, FaComment, FaRetweet, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import '../styles/Post.css';
import { VerificationBadge } from './VerificationBadge';

function Post({ post, currentUserId }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVerification, setUserVerification] = useState(null);

  const handleProfileClick = (userId) => {
    if (userId === currentUserId) {
      navigate('/profile');
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  // Check if user has already liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const postRef = doc(db, 'posts', post.id);
        const postDoc = await getDoc(postRef);
        const likedBy = postDoc.data()?.likedBy || [];
        setIsLiked(likedBy.includes(currentUserId));
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    if (currentUserId) {
      checkLikeStatus();
    }
  }, [post.id, currentUserId]);

  // Check if user has already bookmarked the post
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const userRef = doc(db, 'users', currentUserId);
        const userDoc = await getDoc(userRef);
        const bookmarks = userDoc.data()?.bookmarks || [];
        setIsBookmarked(bookmarks.includes(post.id));
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    if (currentUserId) {
      checkBookmarkStatus();
    }
  }, [post.id, currentUserId]);

  const handleLike = async () => {
    if (!currentUserId) return;

    // Optimistically update UI
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (!isLiked) {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUserId)
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUserId)
        });
      }
    } catch (error) {
      // Revert UI if operation fails
      console.error('Error updating like:', error);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId) return;

    try {
      const userRef = doc(db, 'users', currentUserId);
      
      if (isBookmarked) {
        // Remove bookmark
        await updateDoc(userRef, {
          bookmarks: arrayRemove(post.id)
        });
      } else {
        // Add bookmark
        await updateDoc(userRef, {
          bookmarks: arrayUnion(post.id)
        });
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  useEffect(() => {
    // Debug logging
    console.log('Post data:', post);
    console.log('Verification status:', post.userVerified);
    console.log('Verification type:', post.verificationType);
  }, [post]);

  useEffect(() => {
    const fetchUserVerification = async () => {
      try {
        const userRef = doc(db, 'users', post.userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User verification data:', userData);
          setUserVerification({
            verified: userData.verified || false,
            type: userData.verificationType || 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching user verification:', error);
      }
    };

    if (post.userId) {
      fetchUserVerification();
    }
  }, [post.userId]);

  // Function to format content with hashtags
  const formatContent = (text) => {
    // Split content by spaces and process each word
    return text.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="hashtag">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <div className="post">
      <div className="post-header">
        <img 
          src={post.authorPhoto} 
          alt={post.authorName} 
          className="avatar"
          onClick={() => handleProfileClick(post.userId)}
          style={{ cursor: 'pointer' }}
        />
        <div className="post-info">
          <h4 
            onClick={() => handleProfileClick(post.userId)}
            style={{ cursor: 'pointer' }}
            className="author-name"
          >
            {post.authorName}
            {userVerification?.verified && (
              <VerificationBadge type={userVerification.type} />
            )}
          </h4>
          <span>{new Date(post.createdAt?.toDate()).toLocaleString()}</span>
        </div>
        {post.userId === currentUserId && (
          <button onClick={handleDelete} className="delete-button">
            <FaTrash />
          </button>
        )}
      </div>
      
      <div className="post-content">
        {formatContent(post.content)}
        {post.mediaUrl && (
          post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" />
          ) : (
            <video src={post.mediaUrl} controls />
          )
        )}
        <div className="tags">
          {post.tags?.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="post-actions">
        <button 
          className={`post-action-button ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span className="action-count">{likeCount}</span>
        </button>
        <button className="post-action-button">
          <FaComment />
          <span className="action-count">{post.comments?.length || 0}</span>
        </button>
        <button className="post-action-button">
          <FaRetweet />
          <span className="action-count">{post.retweets || 0}</span>
        </button>
        <button 
          className={`post-action-button ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </div>
  );
}

export default Post; 