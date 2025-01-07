import { useState } from 'react';
import { 
  IoPersonAddOutline, 
  IoVideocamOutline,
  IoTrendingUpOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import '../styles/RightSidebar.css';

function RightSidebar() {
  const [suggestedUsers] = useState([
    {
      id: 1,
      name: 'Sarah Wilson',
      username: '@sarahw',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      username: '@mikechen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      verified: false
    },
    {
      id: 3,
      name: 'Emma Davis',
      username: '@emmad',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      verified: true
    }
  ]);

  const [trendingTopics] = useState([
    {
      id: 1,
      topic: '#JavaScript',
      posts: '125K',
      trending: 'Trending in Tech'
    },
    {
      id: 2,
      topic: '#AI',
      posts: '89K',
      trending: 'Trending Worldwide'
    },
    {
      id: 3,
      topic: '#React',
      posts: '45K',
      trending: 'Trending in Development'
    }
  ]);

  const [liveUsers] = useState([
    {
      id: 1,
      name: 'David Kim',
      viewers: 1.2,
      topic: 'Tech Talk',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      viewers: 3.4,
      topic: 'Art & Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
    },
    {
      id: 3,
      name: 'Tom Wilson',
      viewers: 2.8,
      topic: 'Gaming',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom'
    }
  ]);

  return (
    <div className="right-sidebar">
      <div className="search-container">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search users..."
          className="search-input"
        />
      </div>
      {/* Who to Follow Section */}
      <div className="sidebar-section">
        <h3>Who to Follow</h3>
        <div className="suggested-users">
          {suggestedUsers.map(user => (
            <div key={user.id} className="suggested-user">
              <div className="user-info">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <div className="user-details">
                  <div className="user-name">
                    {user.name}
                    {user.verified && (
                      <IoCheckmarkCircleOutline className="verified-icon" />
                    )}
                  </div>
                  <span className="username">{user.username}</span>
                </div>
              </div>
              <button className="follow-button">
                <IoPersonAddOutline />
                <span>Follow</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="sidebar-section">
        <h3>Trending</h3>
        <div className="trending-list">
          {trendingTopics.map(topic => (
            <div key={topic.id} className="trending-item">
              <IoTrendingUpOutline className="trending-icon" />
              <div className="trending-content">
                <h4>{topic.topic}</h4>
                <span className="trending-stats">{topic.posts} posts</span>
                <span className="trending-category">{topic.trending}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chats Section */}
      <div className="sidebar-section">
        <h3>Live Now</h3>
        <div className="live-users-list">
          {liveUsers.map(user => (
            <div key={user.id} className="live-user">
              <div className="live-user-info">
                <div className="live-avatar-container">
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                  <div className="live-indicator"></div>
                </div>
                <div className="live-user-details">
                  <div className="live-user-name">{user.name}</div>
                  <span className="live-topic">{user.topic}</span>
                </div>
              </div>
              <div className="live-stats">
                <IoVideocamOutline className="live-icon" />
                <span>{user.viewers}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar; 