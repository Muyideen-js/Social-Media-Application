import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, onSnapshot, increment, getDoc, setDoc, collection, query, where } from 'firebase/firestore';
import { IoSendSharp, IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import '../styles/ChatWindow.css';
import CallModal from './CallModal';

const defaultAvatar = 'https://via.placeholder.com/150';

function ChatWindow({ chat, currentUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [incomingCallData, setIncomingCallData] = useState(null);

  // Get other participant's info from chat.participants
  const otherParticipant = chat?.participants?.find(p => p !== currentUser?.uid);

  // Function to get user data
  useEffect(() => {
    if (!otherParticipant) return;

    // Fetch receiver's user data
    const fetchReceiverData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', otherParticipant));
        if (userDoc.exists()) {
          setReceiver({ uid: userDoc.id, ...userDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };

    fetchReceiverData();
  }, [otherParticipant]);

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

  // Listen for incoming calls
  useEffect(() => {
    if (!currentUser?.uid) return;

    // Create a query for calls where current user is the receiver
    const callsRef = collection(db, 'calls');
    const q = query(
      callsRef,
      where('receiverUid', '==', currentUser.uid),
      where('status', '==', 'ringing')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const callData = change.doc.data();
          
          // Fetch caller data
          const callerDoc = await getDoc(doc(db, 'users', callData.callerUid));
          if (callerDoc.exists()) {
            const callerData = { uid: callerDoc.id, ...callerDoc.data() };
            
            setIncomingCallData({
              ...callData,
              caller: callerData
            });
            setCallType(callData.type);
            setIsIncomingCall(true);
            setShowCallModal(true);
          }
        }
        // Handle call ended
        if (change.type === 'modified' && change.doc.data().status === 'ended') {
          setShowCallModal(false);
          setIncomingCallData(null);
        }
      });
    }, (error) => {
      console.error("Error listening for calls:", error);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Handle initiating a call
  const handleCall = (type) => {
    if (!receiver) {
      console.error("Cannot start call: Receiver data not loaded");
      return;
    }
    setCallType(type);
    setIsIncomingCall(false);
    setShowCallModal(true);
  };

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
            alt={otherParticipant?.displayName} 
            className="chat-avatar"
          />
          <span className="chat-username">{otherParticipant?.displayName}</span>
        </div>
        <div className="chat-actions">
          <button className="call-button" onClick={() => handleCall('voice')}>
            <IoCallOutline />
          </button>
          <button className="call-button" onClick={() => handleCall('video')}>
            <IoVideocamOutline />
          </button>
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

      {showCallModal && (isIncomingCall ? incomingCallData : receiver) && (
        <CallModal
          isOpen={showCallModal}
          onClose={() => {
            setShowCallModal(false);
            setIncomingCallData(null);
          }}
          callType={callType}
          caller={isIncomingCall ? incomingCallData.caller : currentUser}
          receiver={isIncomingCall ? currentUser : receiver}
          isIncoming={isIncomingCall}
        />
      )}
    </div>
  );
}

export default ChatWindow; 