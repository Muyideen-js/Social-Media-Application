import Messages from '../components/Messages';
import '../styles/MessagesPage.css';
import '../styles/ChatList.css';

function MessagesPage({ user }) {
  return (
    <div className="messages-page">
      <div className="messages-content">
        <Messages currentUser={user} />
      </div>
    </div>
  );
}

export default MessagesPage; 