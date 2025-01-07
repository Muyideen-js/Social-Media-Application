import { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, writeBatch, arrayUnion, arrayRemove, serverTimestamp, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PostFeed from './PostFeed';
import { AiOutlineEdit, AiOutlineCamera, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { IoLocationOutline, IoCalendarOutline, IoLinkOutline, IoPersonAddOutline, IoPersonRemoveOutline } from 'react-icons/io5';
import LoadingSpinner from './LoadingSpinner';
import Notifications from './Notifications';

const formatCreatedAt = (createdAt) => {
  if (!createdAt) return 'Recently';
  
  // If it's a Firestore timestamp
  if (createdAt.toDate) {
    return new Date(createdAt.toDate()).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // If it's already a Date object or timestamp number
  if (createdAt instanceof Date || typeof createdAt === 'number') {
    return new Date(createdAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  return 'Recently';
};

function Profile({ user, profileUserId }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [location, setLocation] = useState('');
  const isOwnProfile = user?.uid === profileUserId;
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user location
  useEffect(() => {
    const getUserLocation = async () => {
      if (!isOwnProfile) return; // Only get location for own profile

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get location name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        // Extract city and country from the response
        const city = data.address.city || data.address.town || data.address.village;
        const country = data.address.country;
        const locationString = city ? `${city}, ${country}` : country;

        // Update location in Firestore
        const userRef = doc(db, 'users', profileUserId);
        await updateDoc(userRef, {
          location: locationString
        });

        setLocation(locationString);
      } catch (error) {
        console.error('Error getting location:', error);
        setLocation('Location not available');
      }
    };

    if (isOwnProfile) {
      getUserLocation();
    }
  }, [isOwnProfile, profileUserId]);

  // Existing profile fetch effect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', profileUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setProfile(profileData);
          setBio(profileData.bio || '');
          setLocation(profileData.location || '');
        } else {
          console.error('No profile found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (profileUserId) {
      fetchProfile();
    }
  }, [profileUserId]);

  // Check follow status on mount and when user/profileUserId changes
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !profileUserId || isOwnProfile) return;
      
      try {
        // Check if current user is following the profile
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsFollowing(userData.following?.includes(profileUserId) || false);
        }

        // Get followers count
        const profileRef = doc(db, 'users', profileUserId);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setFollowersCount(profileData.followers?.length || 0);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [user, profileUserId, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!user || !profileUserId) return;

    try {
      // First, get both user's data
      const userRef = doc(db, 'users', user.uid);
      const profileRef = doc(db, 'users', profileUserId);
      
      const [currentUserDoc, profileUserDoc] = await Promise.all([
        getDoc(userRef),
        getDoc(profileRef)
      ]);

      const currentUserData = currentUserDoc.data();
      const profileUserData = profileUserDoc.data();

      console.log('Creating notification for:', profileUserId); // Debug log

      if (isFollowing) {
        // Unfollow logic
        await updateDoc(userRef, {
          following: arrayRemove(profileUserId)
        });
        await updateDoc(profileRef, {
          followers: arrayRemove(user.uid)
        });
      } else {
        // Follow logic
        await updateDoc(userRef, {
          following: arrayUnion(profileUserId)
        });
        await updateDoc(profileRef, {
          followers: arrayUnion(user.uid)
        });

        // Create notification
        try {
          await addDoc(collection(db, 'notifications'), {
            type: 'follow',
            fromUserId: user.uid,
            fromUserName: currentUserData.displayName,
            fromUserAvatar: currentUserData.avatarUrl || currentUserData.photoURL,
            toUserId: profileUserId,
            read: false,
            createdAt: serverTimestamp()
          });
          console.log('Notification created successfully'); // Debug log
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
        }
      }

      // Update local state
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);

    } catch (error) {
      console.error('Error in follow/unfollow process:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const userRef = doc(db, 'users', profileUserId);

    try {
      let avatarUrl = profile?.avatarUrl;
      if (newAvatar) {
        const fileRef = ref(storage, `avatars/${profileUserId}`);
        await uploadBytes(fileRef, newAvatar);
        avatarUrl = await getDownloadURL(fileRef);
      }

      let coverUrl = profile?.coverUrl;
      if (newCover) {
        const fileRef = ref(storage, `covers/${profileUserId}`);
        await uploadBytes(fileRef, newCover);
        coverUrl = await getDownloadURL(fileRef);
      }

      await updateDoc(userRef, {
        bio,
        avatarUrl,
        coverUrl,
        location,
        updatedAt: new Date()
      });

      setIsEditing(false);
      setProfile(prev => ({ ...prev, bio, avatarUrl, coverUrl, location }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Add real-time listener for profile updates
  useEffect(() => {
    if (!profileUserId) return;

    const profileRef = doc(db, 'users', profileUserId);
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile(data);
        setFollowersCount(data.followers?.length || 0);
      }
    });

    return () => unsubscribe();
  }, [profileUserId]);

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-wrapper">
          <div className="cover-image" style={{ 
            backgroundImage: `url(${profile.coverUrl})`,
          }}>
            <div className="cover-overlay"></div>
          </div>
          {isOwnProfile && isEditing && (
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
              {isOwnProfile && isEditing && (
                <label className="avatar-upload-btn">
                  <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files[0])} hidden />
                  <AiOutlineCamera />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1>{profile.displayName}</h1>
              <p className="username">@{profile.username || profile.displayName.toLowerCase().replace(/\s+/g, '')}</p>
              <p className="bio">{profile.bio || 'No bio yet'}</p>
            </div>
          </div>
          <div className="profile-actions">
            {isOwnProfile ? (
              !isEditing ? (
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
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
              )
            ) : (
              <button 
                className={`follow-profile-btn ${isFollowing ? 'following-btn' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  <>
                    <IoPersonRemoveOutline />
                    <span className="follow-text">Following</span>
                  </>
                ) : (
                  <>
                    <IoPersonAddOutline />
                    <span className="follow-text">Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{profile?.posts?.length || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile?.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          <div className="profile-meta">
            <div className="meta-item">
              <IoLocationOutline />
              <span>{profile.location || 'No location'}</span>
            </div>
            <div className="meta-item">
              <IoCalendarOutline />
              <span>Joined {formatCreatedAt(profile.createdAt)}</span>
            </div>
            {profile.website && (
              <div className="meta-item">
                <IoLinkOutline />
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-posts">
        <h3>Posts</h3>
        <PostFeed userId={profileUserId} />
      </div>

      {isOwnProfile && (
        <div className="profile-section">
          <Notifications userId={profileUserId} />
        </div>
      )}
    </div>
  );
}

export default Profile; 