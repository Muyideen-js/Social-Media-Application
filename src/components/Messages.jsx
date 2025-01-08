import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { IoMdChatboxes } from 'react-icons/io';
import '../styles/Messages.css';

function Messages({ currentUser }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <ChatList 
          chats={chats} 
          selectedChat={selectedChat} 
          onSelectChat={setSelectedChat}
          currentUser={currentUser}
        />
      </div>
      <div className="messages-main">
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            currentUser={currentUser}
          />
        ) : (
          <div className="no-chat-selected">
            <IoMdChatboxes className="no-chat-icon" />
            <h3>No conversation selected</h3>
            <p>Choose a chat from the list or start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages; 