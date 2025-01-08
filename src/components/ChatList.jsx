import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { IoMdPersonAdd } from 'react-icons/io';
import { BsDot } from 'react-icons/bs';

const defaultAvatar = 'https://via.placeholder.com/150';

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
      <div className="chat-list-header">
        <h2>Conversations</h2>
        <form onSubmit={createNewChat} className="new-chat-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={newChatUser}
              onChange={(e) => setNewChatUser(e.target.value)}
              placeholder="Enter user ID to chat"
            />
            <button type="submit">
              <IoMdPersonAdd />
            </button>
          </div>
        </form>
      </div>

      <div className="chats-container">
        {chats.length === 0 ? (
          <div className="no-chats">
            <p>No conversations yet</p>
            <small>Start a new chat to begin messaging</small>
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                <img src={defaultAvatar} alt="User" />
                <span className="online-status">
                  <BsDot />
                </span>
              </div>
              <div className="chat-preview">
                <div className="chat-header">
                  <h4>
                    {chat.participants
                      .filter(p => p !== currentUser.uid)
                      .join(', ')}
                  </h4>
                  <span className="chat-time">
                    {chat.lastMessageAt?.toDate().toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="last-message">{chat.lastMessage?.text || 'Start a conversation'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList; 