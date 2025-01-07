import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';
import '../styles/ProfilePage.css';

function ProfilePage({ user }) {
  const { userId } = useParams();
  const profileUserId = userId || user?.uid;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!profileUserId) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <Profile user={user} profileUserId={profileUserId} />
    </div>
  );
}

export default ProfilePage; 