import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

function ChatWindow({ chat, currentUser }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const chatRef = doc(db, 'chats', chat.id);
    try {
      await updateDoc(chatRef, {
        messages: arrayUnion({
          text: message,
          senderId: currentUser.uid,
          timestamp: serverTimestamp()
        }),
        lastMessage: {
          text: message,
          senderId: currentUser.uid,
          timestamp: serverTimestamp()
        },
        lastMessageAt: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === currentUser.uid ? 'sent' : 'received'
            }`}
          >
            <p>{msg.text}</p>
            <span className="timestamp">
              {msg.timestamp?.toDate().toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow; 