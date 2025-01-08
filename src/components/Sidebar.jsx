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

function Sidebar({ user }) {
  const location = useLocation();
  const menuItems = [
    { icon: IoHomeSharp, label: 'Home', path: '/' },
    { icon: IoNotificationsOutline, label: 'Notifications', path: '/notifications' },
    { icon: IoChatbubbleOutline, label: 'Messages', path: '/messages' },
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
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