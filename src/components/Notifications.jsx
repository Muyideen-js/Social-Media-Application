import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { IoPersonAdd } from 'react-icons/io5';
import '../styles/Notifications.css';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    console.log('Fetching notifications for userId:', userId); // Debug log

    // Query notifications for this user
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Snapshot received, docs count:', snapshot.docs.length); // Debug log
      
      const newNotifications = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Notification data:', data); // Debug log
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      
      setNotifications(newNotifications);
      setLoading(false);
      console.log('Processed notifications:', newNotifications); // Debug log
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <div className="notifications-loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      <h3 className="notifications-title">Notifications</h3>
      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications yet</div>
      ) : (
        notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-avatar">
              <img 
                src={notification.fromUserAvatar} 
                alt={notification.fromUserName} 
                onError={(e) => {
                  e.target.src = '/default-avatar.png'; // Add a default avatar image
                }}
              />
            </div>
            <div className="notification-content">
              <p>
                <strong>{notification.fromUserName}</strong>
                {notification.type === 'follow' && ' started following you'}
              </p>
              <span className="notification-time">
                {notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString()}
              </span>
            </div>
            {notification.type === 'follow' && (
              <div className="notification-icon">
                <IoPersonAdd />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;