import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/WhoToFollow.css';

function WhoToFollow({ currentUser }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!currentUser) return;

      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          where('uid', '!=', currentUser.uid),
          limit(3)
        );
        
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => !currentUser.following?.includes(user.id));

        setSuggestedUsers(users);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, [currentUser]);

  return (
    <div className="who-to-follow">
      <h3>Who to Follow</h3>
      <div className="suggested-users">
        {suggestedUsers.map(user => (
          <Link to={`/profile/${user.id}`} key={user.id} className="suggested-user">
            <img 
              src={user.photoURL || user.avatarUrl} 
              alt={user.displayName}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="user-info">
              <span className="user-name">{user.displayName}</span>
              <span className="user-handle">@{user.username || user.displayName?.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WhoToFollow; 