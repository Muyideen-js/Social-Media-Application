import Messages from '../components/Messages';
import { FiSearch } from 'react-icons/fi';
import '../styles/MessagesPage.css';

function MessagesPage({ user }) {
  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="messages-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search messages..."
            className="search-input"
          />
        </div>
      </div>
      <div className="messages-content">
        <Messages currentUser={user} />
      </div>
    </div>
  );
}

export default MessagesPage; 