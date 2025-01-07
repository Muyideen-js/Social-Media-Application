import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaBookmark } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
        <FaHome />
        <span>Home</span>
      </Link>
      <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
        <FaUser />
        <span>Profile</span>
      </Link>
      <Link to="/bookmarks" className={`nav-link ${location.pathname === '/bookmarks' ? 'active' : ''}`}>
        <FaBookmark />
        <span>Bookmarks</span>
      </Link>
    </nav>
  );
}

export default Navbar; 