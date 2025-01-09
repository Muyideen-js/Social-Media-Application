import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { IoMdPersonAdd } from 'react-icons/io';
import { BsDot } from 'react-icons/bs';
import { IoClose, IoSearch } from 'react-icons/io5';
import '../styles/ChatList.css';

const defaultAvatar = 'https://via.placeholder.com/150';

function ChatList({ chats, selectedChat, onSelectChat, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatListSearch, setChatListSearch] = useState('');

  const filteredChats = chats.filter(chat => {
    if (!chatListSearch) return true;
    
    const otherParticipantId = chat.participants.find(id => id !== currentUser.uid);
    const otherParticipant = chat.participantProfiles[otherParticipantId];
    const searchLower = chatListSearch.toLowerCase();
    
    return (
      otherParticipant?.email?.toLowerCase().includes(searchLower) ||
      otherParticipant?.displayName?.toLowerCase().includes(searchLower)
    );
  });

  const searchUsers = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('email', '>=', searchQuery.toLowerCase()),
        where('email', '<=', searchQuery.toLowerCase() + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUser.uid);
      
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async (selectedUser) => {
    try {
      // Check if chat already exists
      const existingChat = chats.find(chat => 
        chat.participants.includes(selectedUser.id) && 
        chat.participants.includes(currentUser.uid)
      );

      if (existingChat) {
        onSelectChat(existingChat);
        setIsModalOpen(false);
        return;
      }

      // Create new chat document with both users' information
      const chatData = {
        participants: [currentUser.uid, selectedUser.id],
        participantProfiles: {
          [currentUser.uid]: {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email,
            photoURL: currentUser.photoURL || defaultAvatar,
            uid: currentUser.uid
          },
          [selectedUser.id]: {
            email: selectedUser.email,
            displayName: selectedUser.displayName || selectedUser.email,
            photoURL: selectedUser.photoURL || defaultAvatar,
            uid: selectedUser.id
          }
        },
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messages: [],
        lastMessage: null,
        // Add this to ensure both users can access the chat
        userIds: [currentUser.uid, selectedUser.id]
      };

      // Add to Firestore
      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      
      // Select the new chat
      onSelectChat({
        id: chatRef.id,
        ...chatData
      });
      
      setIsModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <div className="chat-list-search">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={chatListSearch}
            onChange={(e) => setChatListSearch(e.target.value)}
          />
        </div>
        <button className="new-chat-button" onClick={() => setIsModalOpen(true)}>
          <IoMdPersonAdd />
        </button>
      </div>

      <div className="chats-container">
        {filteredChats.length === 0 ? (
          <div className="no-chats">
            {chatListSearch ? (
              <p>No conversations found</p>
            ) : (
              <>
                <p>No conversations yet</p>
                <small>Start a new chat to begin messaging</small>
              </>
            )}
          </div>
        ) : (
          filteredChats.map(chat => {
            const otherParticipantId = chat.participants.find(id => id !== currentUser.uid);
            const otherParticipant = chat.participantProfiles[otherParticipantId];
            
            const timestamp = chat.lastMessageAt?.toDate?.() || chat.lastMessageAt;
            const timeString = timestamp instanceof Date 
              ? timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : '';
            
            return (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                onClick={() => onSelectChat(chat)}
              >
                <div className="chat-avatar">
                  <img 
                    src={otherParticipant?.photoURL || defaultAvatar} 
                    alt={otherParticipant?.displayName || 'User'} 
                  />
                  <span className="online-status">
                    <BsDot />
                  </span>
                </div>
                <div className="chat-preview">
                  <div className="chat-header">
                    <h4>
                      {otherParticipant?.displayName || otherParticipant?.email || 'Unknown User'}
                    </h4>
                    <span className="chat-time">
                      {timeString}
                    </span>
                  </div>
                  <p className="last-message">
                    {chat.lastMessage?.text || 'Start a conversation'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="search-modal">
            <div className="modal-header">
              <h3>Start a New Chat</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <IoClose />
              </button>
            </div>
            <form onSubmit={searchUsers} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by email..."
                autoFocus
              />
              <button type="submit">Search</button>
            </form>
            <div className="search-results">
              {loading ? (
                <div className="loading">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div 
                    key={user.id} 
                    className="user-result"
                    onClick={() => createNewChat(user)}
                  >
                    <img src={user.photoURL || defaultAvatar} alt={user.email} />
                    <div className="user-info">
                      <h4>{user.displayName || user.email}</h4>
                      {user.displayName && <p>{user.email}</p>}
                    </div>
                  </div>
                ))
              ) : searchQuery && !loading ? (
                <div className="no-results">No users found</div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList; 