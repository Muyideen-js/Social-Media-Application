import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import Auth from './pages/Auth';
import Notifications from './pages/Notifications';
import More from './pages/More';
import RightSidebar from './components/RightSidebar';
import BookmarkedPosts from './components/BookmarkedPosts';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hideRightSidebarPaths = ['/messages'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Auth />;
  }

  const shouldShowRightSidebar = !hideRightSidebarPaths.includes(location.pathname);

  return (
    <div className={`app-container ${!shouldShowRightSidebar ? 'messages-layout' : ''}`}>
      {user && <Sidebar user={user} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/profile/:userId" element={<ProfilePage user={user} />} />
          <Route path="/messages" element={<MessagesPage user={user} />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/more" element={<More />} />
          <Route path="/bookmarks" element={<BookmarkedPosts userId={user.uid} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
