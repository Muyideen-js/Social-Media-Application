import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Ensure we have all the user data we need
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

  return (
    <Router>
      <div className="app-container">
        <Sidebar user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/profile/:userId" element={<ProfilePage user={user} />} />
            <Route path="/messages" element={<MessagesPage user={user} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/more" element={<More />} />
            <Route 
              path="/bookmarks" 
              element={<BookmarkedPosts userId={user.uid} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <RightSidebar />
      </div>
    </Router>
  );
}

export default App;
