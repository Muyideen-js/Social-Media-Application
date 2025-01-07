import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function ChatList({ chats, selectedChat, onSelectChat, currentUser }) {
  const [newChatUser, setNewChatUser] = useState('');

  const createNewChat = async (e) => {
    e.preventDefault();
    if (!newChatUser.trim()) return;

    try {
      await addDoc(collection(db, 'chats'), {
        participants: [currentUser.uid, newChatUser],
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        messages: []
      });
      setNewChatUser('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="chat-list">
      <form onSubmit={createNewChat} className="new-chat-form">
        <input
          type="text"
          value={newChatUser}
          onChange={(e) => setNewChatUser(e.target.value)}
          placeholder="Enter user ID to start chat"
        />
        <button type="submit">New Chat</button>
      </form>

      <div className="chats">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-preview">
              <h4>
                {chat.participants
                  .filter(p => p !== currentUser.uid)
                  .join(', ')}
              </h4>
              <p>{chat.lastMessage?.text || 'No messages yet'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList; 