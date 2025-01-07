import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AiOutlineEdit, AiOutlineSave, AiOutlineClose, AiOutlineCamera } from 'react-icons/ai';
import { FaUserFriends, FaRegNewspaper, FaMapMarkerAlt, FaLink, FaRegImage, FaRegHeart } from 'react-icons/fa';
import { BsPeople, BsCalendarEvent } from 'react-icons/bs';
import PostFeed from '../components/PostFeed';
import EditProfileModal from '../components/EditProfileModal';
import useLocation from '../hooks/useLocation';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats] = useState({
    followers: 1234,
    following: 567,
    posts: 89
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        setLoading(false);
        setError('User not found');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setProfile(profileData);
          setBio(profileData.bio || '');
        } else {
          // Initialize profile if it doesn't exist
          const initialProfile = {
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            email: user.email || '',
            bio: '',
            createdAt: new Date().toISOString()
          };
          
          await setDoc(docRef, initialProfile);
          setProfile(initialProfile);
          setBio('');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      let avatarUrl = profile?.avatarUrl;
      let coverUrl = profile?.coverUrl;

      if (newAvatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, newAvatar);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      if (newCover) {
        const coverRef = ref(storage, `covers/${user.uid}`);
        await uploadBytes(coverRef, newCover);
        coverUrl = await getDownloadURL(coverRef);
      }

      const updateData = {
        bio,
        updatedAt: new Date().toISOString()
      };

      if (avatarUrl) updateData.avatarUrl = avatarUrl;
      if (coverUrl) updateData.coverUrl = coverUrl;

      await updateDoc(userRef, updateData);
      setProfile(prev => ({ ...prev, ...updateData }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsModalOpen(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">No profile found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-wrapper">
          <div className="cover-image" style={{ 
            backgroundImage: `url(${profile.coverUrl})`,
          }}>
            <div className="cover-overlay"></div>
          </div>
          {isEditing && (
            <label className="cover-upload-btn">
              <input type="file" accept="image/*" onChange={(e) => setNewCover(e.target.files[0])} hidden />
              <AiOutlineCamera />
            </label>
          )}
        </div>

        <div className="profile-nav">
          <div className="profile-nav-left">
            <div className="profile-avatar-container">
              <img src={profile.avatarUrl || profile.photoURL} alt={profile.displayName} />
              {isEditing && (
                <label className="avatar-upload-btn">
                  <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files[0])} hidden />
                  <AiOutlineCamera />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1>{profile.displayName}</h1>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={() => setIsModalOpen(true)}>
                <AiOutlineEdit /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleUpdateProfile}>
                  <AiOutlineSave /> Save
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <AiOutlineClose /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <FaUserFriends />
            <div className="stat-info">
              <span className="stat-value">12.5K</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
          <div className="stat-item">
            <BsPeople />
            <div className="stat-info">
              <span className="stat-value">1.2K</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <div className="stat-item">
            <FaRegNewspaper />
            <div className="stat-info">
              <span className="stat-value">3.4K</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </div>

        <div className="profile-meta">
          <span>
            <FaMapMarkerAlt />
            {location.loading ? (
              <span className="loading-location">Detecting location...</span>
            ) : location.error ? (
              <span className="location-error">Location unavailable</span>
            ) : (
              `${location.city}, ${location.country}`
            )}
          </span>
          <span><BsCalendarEvent /> Joined {new Date(user.createdAt).getFullYear()}</span>
          <span><FaLink /> website.com</span>
        </div>

        <div className="bio-section">
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              maxLength={160}
            />
          ) : (
            <p>{profile.bio || 'No bio yet'}</p>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="content-nav">
          <button className="nav-item active">
            <FaRegNewspaper />
            <span>Posts</span>
            <span className="count">24</span>
          </button>
          <button className="nav-item">
            <FaRegImage />
            <span>Media</span>
            <span className="count">12</span>
          </button>
          <button className="nav-item">
            <FaRegHeart />
            <span>Likes</span>
            <span className="count">48</span>
          </button>
        </div>

        <div className="posts-grid">
          <PostFeed userId={user.uid} />
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

export default Profile; 