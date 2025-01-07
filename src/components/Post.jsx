import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { FaTrash, FaHeart, FaRegHeart, FaComment, FaRetweet, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import '../styles/Post.css';

function Post({ post, currentUserId }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (isLiked) {
        // Unlike post
        await updateDoc(postRef, {
          likes: likeCount - 1,
          likedBy: arrayRemove(currentUserId)
        });
        setLikeCount(prev => prev - 1);
      } else {
        // Like post
        await updateDoc(postRef, {
          likes: likeCount + 1,
          likedBy: arrayUnion(currentUserId)
        });
        setLikeCount(prev => prev + 1);

        // Create notification for post author
        if (post.authorId !== currentUserId) {
          await addDoc(collection(db, 'notifications'), {
            type: 'like',
            postId: post.id,
            postContent: post.content?.substring(0, 50) + '...',
            fromUserId: currentUserId,
            fromUserName: auth.currentUser.displayName,
            fromUserPhoto: auth.currentUser.photoURL,
            toUserId: post.authorId,
            createdAt: serverTimestamp(),
            read: false
          });
        }
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
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

  return (
    <div className="post">
      <div className="post-header">
        <img 
          src={post.authorPhoto} 
          alt={post.authorName} 
          className="avatar"
          onClick={() => handleProfileClick(post.authorId)}
          style={{ cursor: 'pointer' }}
        />
        <div className="post-info">
          <h4 
            onClick={() => handleProfileClick(post.authorId)}
            style={{ cursor: 'pointer' }}
            className="author-name"
          >
            {post.authorName}
          </h4>
          <span>{new Date(post.createdAt?.toDate()).toLocaleString()}</span>
        </div>
        {post.authorId === currentUserId && (
          <button onClick={handleDelete} className="delete-post-btn">
            <FaTrash />
          </button>
        )}
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
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