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