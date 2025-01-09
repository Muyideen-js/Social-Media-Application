import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  IoHomeSharp,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoBookmarkOutline,
  IoPersonOutline,
  IoEllipsisHorizontalCircleOutline,
  IoLogOutOutline
} from 'react-icons/io5';
import '../styles/Sidebar.css';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Sidebar({ user }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Add effect to listen for unread messages
  useEffect(() => {
    if (!user?.uid) return;

    // Query chats where user is a participant
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.docs.forEach(doc => {
        const chat = doc.data();
        // Add unread messages from this chat
        count += chat.unreadCount?.[user.uid] || 0;
      });
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const menuItems = [
    { icon: IoHomeSharp, label: 'Home', path: '/' },
    { icon: IoNotificationsOutline, label: 'Notifications', path: '/notifications' },
    { 
      icon: IoChatbubbleOutline, 
      label: 'Messages', 
      path: '/messages',
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { icon: IoBookmarkOutline, label: 'Bookmarks', path: '/bookmarks' },
    { icon: IoPersonOutline, label: 'Profile', path: '/profile' },
    { icon: IoEllipsisHorizontalCircleOutline, label: 'More', path: '/more' },
    {
      icon: () => null,
      label: (
        <button 
          style={{
            background: 'linear-gradient(45deg, #FF4B4B, #FF7676)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            padding: '8px 20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            width: '180px',
            boxShadow: '0 4px 15px rgba(255, 75, 75, 0.2)',
            pointerEvents: 'none'
          }}
        >
          Go Live
        </button>
      ),
      path: '/live'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>WiChat</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>
                {item.label}
                {item.badge && <span className="badge">{item.badge}</span>}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="user-section">
        <img src={user.photoURL} alt={user.displayName} className="avatar" />
        <div className="user-info">
          <span className="user-name">{user.displayName}</span>
          <span className="user-email">{user.email}</span>
        </div>
        <button onClick={handleSignOut} className="logout-btn">
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}

export default Sidebar; 