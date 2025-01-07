import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

function Messages({ currentUser }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
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
      <ChatList 
        chats={chats} 
        selectedChat={selectedChat} 
        onSelectChat={setSelectedChat}
        currentUser={currentUser}
      />
      {selectedChat ? (
        <ChatWindow 
          chat={selectedChat} 
          currentUser={currentUser}
        />
      ) : (
        <div className="no-chat-selected">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}

export default Messages; 