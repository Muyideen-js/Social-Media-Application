import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, onSnapshot, increment } from 'firebase/firestore';
import { IoSendSharp } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import '../styles/ChatWindow.css';

const defaultAvatar = 'https://via.placeholder.com/150';

function ChatWindow({ chat, currentUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Add click outside handler for emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Listen for real-time message updates
  useEffect(() => {
    if (!chat?.id) return;

    const chatRef = doc(db, 'chats', chat.id);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        setMessages(chatData.messages || []);
      }
    });

    return () => unsubscribe();
  }, [chat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const chatRef = doc(db, 'chats', chat.id);
    const now = new Date();
    const newMessage = {
      text: message,
      senderId: currentUser.uid,
      timestamp: now,
      senderName: currentUser.displayName || currentUser.email
    };

    try {
      const otherUserId = chat.participants.find(id => id !== currentUser.uid);
      
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
        lastMessage: newMessage,
        lastMessageAt: now,
        [`unreadCount.${otherUserId}`]: increment(1)
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Add this useEffect to mark messages as read when viewing chat
  useEffect(() => {
    if (!chat?.id || !currentUser?.uid) return;

    const chatRef = doc(db, 'chats', chat.id);
    updateDoc(chatRef, {
      [`unreadCount.${currentUser.uid}`]: 0
    });
  }, [chat?.id, currentUser?.uid]);

  const otherParticipant = chat.participantProfiles[
    chat.participants.find(id => id !== currentUser.uid)
  ];

  const onEmojiClick = (emojiObject) => {
    setMessage(prevMsg => prevMsg + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp?.toDate?.() || timestamp;
    if (!(date instanceof Date) || isNaN(date)) return '';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <img 
            src={otherParticipant?.photoURL || defaultAvatar} 
            alt={otherParticipant?.displayName || 'User'} 
            className="chat-user-avatar"
          />
          <h3>{otherParticipant?.displayName || otherParticipant?.email || 'User'}</h3>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {formatMessageTime(msg.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-container">
        <div className="input-wrapper">
          <div className="emoji-picker-container" ref={emojiPickerRef}>
            <button 
              type="button" 
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile />
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-wrapper">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
        </div>
        <button type="submit" className="send-button" disabled={!message.trim()}>
          <IoSendSharp />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow; 