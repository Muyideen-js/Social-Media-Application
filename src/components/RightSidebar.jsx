import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiSearch } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import { 
  FaCode, 
  FaLaptopCode, 
  FaGamepad, 
  FaMusic, 
  FaFilm,
  FaGraduationCap,
  FaUserPlus
} from 'react-icons/fa';
import '../styles/RightSidebar.css';

function RightSidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([
    { 
      id: 1, 
      name: 'JavaScript', 
      posts: 1234, 
      location: 'Worldwide',
      category: 'Programming',
      categoryIcon: FaCode
    },
    { 
      id: 2, 
      name: 'React', 
      posts: 890, 
      location: 'United States',
      category: 'Web Development',
      categoryIcon: FaLaptopCode
    },
    { 
      id: 3, 
      name: 'Cyberpunk2077', 
      posts: 756, 
      location: 'India',
      category: 'Gaming',
      categoryIcon: FaGamepad
    },
    { 
      id: 4, 
      name: 'TaylorSwift', 
      posts: 654, 
      location: 'United Kingdom',
      category: 'Music',
      categoryIcon: FaMusic
    },
    { 
      id: 5, 
      name: 'Oppenheimer', 
      posts: 543, 
      location: 'Canada',
      category: 'Entertainment',
      categoryIcon: FaFilm
    },
    { 
      id: 6, 
      name: 'AI Learning', 
      posts: 432, 
      location: 'Global',
      category: 'Education',
      categoryIcon: FaGraduationCap
    }
  ]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        console.log('Starting to fetch users...');
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(5));
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot size:', querySnapshot.size);
        
        const users = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log('User data:', userData);
          users.push({
            id: doc.id,
            ...userData
          });
        });

        console.log('Processed users:', users);
        setSuggestedUsers(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="right-sidebar">
      {/* Search Input at the very top */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search users or posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Trending Section */}
      <div className="sidebar-section trending">
        <h3>
          <FiTrendingUp className="section-icon" />
          Trending
        </h3>
        {trendingTopics.map(topic => {
          const CategoryIcon = topic.categoryIcon;
          return (
            <div key={topic.id} className="trending-topic">
              <div className="topic-category">
                <CategoryIcon className="category-icon" />
                <span>{topic.category}</span>
              </div>
              <div className="topic-header">
                <span className="topic-name">#{topic.name}</span>
                <div className="topic-location">
                  <IoLocationOutline className="location-icon" />
                  <span>{topic.location}</span>
                </div>
              </div>
              <span className="topic-posts">
                <FiTrendingUp className="trend-icon" />
                {topic.posts.toLocaleString()} posts
              </span>
            </div>
          );
        })}
      </div>

      {/* Who To Follow Section */}
      <div className="sidebar-section who-to-follow">
        <h3>
          <FaUserPlus className="section-icon" />
          Who to Follow
        </h3>
        <div className="who-to-follow-list">
          {loading ? (
            <div className="loading-users">Loading suggestions...</div>
          ) : suggestedUsers.length === 0 ? (
            <div className="no-suggestions">No suggestions available</div>
          ) : (
            <>
              {suggestedUsers.map(user => (
                <Link 
                  to={`/profile/${user.id}`} 
                  key={user.id} 
                  className="who-to-follow-item"
                >
                  <div className="user-avatar">
                    <img 
                      src={user.photoURL || user.avatarUrl || '/default-avatar.png'} 
                      alt={user.displayName}
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {user.displayName || 'Anonymous User'}
                    </span>
                    <span className="user-handle">
                      @{user.username || user.displayName?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                    </span>
                    <span className="user-bio">
                      {user.bio?.substring(0, 50) || 'No bio yet'}
                    </span>
                  </div>
                  <button 
                    className="follow-button"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add follow logic here
                    }}
                  >
                    Follow
                  </button>
                </Link>
              ))}
              <button className="show-more">Show more</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar; 