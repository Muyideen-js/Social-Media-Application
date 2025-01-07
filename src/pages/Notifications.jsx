import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { IoPersonAdd } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import '../styles/Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    console.log('Current user ID:', currentUser.uid);

    const q = query(
      collection(db, 'notifications'),
      where('toUserId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Snapshot received:', snapshot.docs.length, 'notifications');
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setNotifications(newNotifications);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="notifications-loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-page">
      <h2 className="notifications-header">Notifications</h2>
      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications yet</div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-avatar">
                <img 
                  src={notification.fromUserAvatar || notification.fromUserPhoto} 
                  alt={notification.fromUserName}
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="notification-content">
                <p>
                  <strong>{notification.fromUserName}</strong>
                  {notification.type === 'follow' && ' started following you'}
                  {notification.type === 'like' && (
                    <>
                      {' liked your post: '}
                      <span className="notification-post-content">
                        {notification.postContent}
                      </span>
                    </>
                  )}
                </p>
                <span className="notification-time">
                  {formatTimeAgo(notification.createdAt)}
                </span>
              </div>
              <div className="notification-icon">
                {notification.type === 'follow' && <IoPersonAdd />}
                {notification.type === 'like' && <FaHeart />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;