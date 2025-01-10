import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/Comment.css';

function Comment({ comment, postId, currentUserId, onDelete }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(comment.likedBy?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  const handleProfileClick = (userId) => {
    if (userId === currentUserId) {
      navigate('/profile');
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const handleLike = async () => {
    if (!currentUserId) return;

    try {
      const commentRef = doc(db, 'posts', postId, 'comments', comment.id);
      
      if (isLiked) {
        // Unlike comment
        await updateDoc(commentRef, {
          likes: likeCount - 1,
          likedBy: comment.likedBy.filter(id => id !== currentUserId)
        });
        setLikeCount(prev => prev - 1);
      } else {
        // Like comment
        await updateDoc(commentRef, {
          likes: likeCount + 1,
          likedBy: [...(comment.likedBy || []), currentUserId]
        });
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const commentRef = doc(db, 'posts', postId, 'comments', comment.id);
        await deleteDoc(commentRef);
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <img 
          src={comment.authorPhoto} 
          alt={comment.authorName} 
          className="comment-avatar"
          onClick={() => handleProfileClick(comment.authorId)}
        />
        <div className="comment-info">
          <h4 
            onClick={() => handleProfileClick(comment.authorId)}
            className="comment-author"
          >
            {comment.authorName}
          </h4>
          <span className="comment-time">
            {new Date(comment.createdAt?.toDate()).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="comment-content">{comment.text}</p>

      <div className="comment-actions">
        <button 
          className={`comment-action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span className="action-count">{likeCount}</span>
        </button>

        {comment.authorId === currentUserId && (
          <button 
            className="comment-action-button delete"
            onClick={handleDelete}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
}

export default Comment; 