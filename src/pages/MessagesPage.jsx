import Messages from '../components/Messages';

function MessagesPage({ user }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Messages</h1>
      </div>
      <Messages currentUser={user} />
    </div>
  );
}

export default MessagesPage; 