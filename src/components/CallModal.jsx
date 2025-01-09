import { useState, useEffect, useRef } from 'react';
import { IoCallOutline, IoVideocamOutline, IoCloseOutline, IoMicOutline, IoMicOffOutline, IoVideocamOffOutline } from 'react-icons/io5';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import '../styles/CallModal.css';

function CallModal({ isOpen, onClose, callType, caller, receiver, isIncoming = false }) {
  const [callStatus, setCallStatus] = useState('initializing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  // WebRTC state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  
  // Add this function to generate a consistent call ID
  const getCallId = () => {
    const ids = [caller.uid, receiver.uid].sort();
    return `${ids[0]}-${ids[1]}`;
  };

  // Initialize WebRTC connection
  useEffect(() => {
    if (!isOpen || !caller?.uid || !receiver?.uid) return;

    let mounted = true;

    const initializeCall = async () => {
      try {
        // Validate required data
        if (!caller.uid || !receiver.uid) {
          throw new Error('Missing caller or receiver data');
        }

        const callId = [caller.uid, receiver.uid].sort().join('-');
        const callDoc = doc(db, 'calls', callId);

        // Get user media before creating the call document
        const constraints = {
          audio: true,
          video: callType === 'video'
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        localStream.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize RTCPeerConnection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });

        // Add tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });

        if (!isIncoming) {
          // Create offer for outgoing calls
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          // Create new call document for outgoing calls
          await setDoc(callDoc, {
            callerUid: caller.uid,
            receiverUid: receiver.uid,
            type: callType,
            status: 'ringing',
            startedAt: new Date(),
            userIds: [caller.uid, receiver.uid],
            offer: {
              type: offer.type,
              sdp: offer.sdp
            }
          });
        }

        setCallStatus('ringing');
      } catch (error) {
        console.error('Error initializing call:', error);
        if (mounted) {
          handleEndCall();
        }
      }
    };

    initializeCall();

    return () => {
      mounted = false;
      // Cleanup
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [isOpen, callType, isIncoming, caller?.uid, receiver?.uid]);

  // Add proper cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    }
  }, [isOpen]);

  // Listen for remote ICE candidates and offer/answer
  useEffect(() => {
    if (!isOpen || !caller?.uid || !receiver?.uid) return;

    const callId = [caller.uid, receiver.uid].sort().join('-');
    const callDoc = doc(db, 'calls', callId);

    const unsubscribe = onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      // Handle offer for receiver
      if (isIncoming && data.offer && !peerConnection.current.currentRemoteDescription) {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          
          // Create answer only after setting remote description
          if (data.status === 'ringing') {
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            
            await updateDoc(callDoc, {
              answer: {
                type: answer.type,
                sdp: answer.sdp
              },
              status: 'connected'
            });
          }
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }

      // Handle answer for caller
      if (!isIncoming && data.answer && !peerConnection.current.currentRemoteDescription) {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }

      // Handle ICE candidates
      if (data.candidates) {
        try {
          for (const candidate of data.candidates) {
            if (!peerConnection.current.remoteDescription) continue;
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [isOpen, isIncoming, caller?.uid, receiver?.uid]);

  // Update handleAcceptCall to only update status
  const handleAcceptCall = async () => {
    try {
      const callId = [caller.uid, receiver.uid].sort().join('-');
      const callDoc = doc(db, 'calls', callId);
      
      await updateDoc(callDoc, {
        status: 'accepted'
      });

      setCallStatus('connecting');
    } catch (error) {
      console.error('Error accepting call:', error);
      handleEndCall();
    }
  };

  // Handle call rejection/ending
  const handleEndCall = async () => {
    try {
      if (!caller?.uid || !receiver?.uid) return;

      const callId = [caller.uid, receiver.uid].sort().join('-');
      const callDoc = doc(db, 'calls', callId);
      
      await updateDoc(callDoc, {
        status: 'ended',
        endedAt: new Date(),
        endedBy: caller.uid,
        userIds: [caller.uid, receiver.uid] // Add this for security rules
      });

      // Cleanup resources
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      setCallStatus('ended');
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
      onClose();
    }
  };

  useEffect(() => {
    let timer;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Listen for call status changes
  useEffect(() => {
    if (!isOpen || !caller?.uid || !receiver?.uid) return;

    const callId = [caller.uid, receiver.uid].sort().join('-');
    const callDoc = doc(db, 'calls', callId);

    const unsubscribe = onSnapshot(callDoc, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.status === 'ended') {
          handleEndCall();
        } else if (data.status === 'connected') {
          setCallStatus('connected');
        }
      }
    });

    return () => unsubscribe();
  }, [isOpen, caller?.uid, receiver?.uid]);

  // Add WebRTC connection handlers
  useEffect(() => {
    if (!peerConnection.current) return;

    // Handle ICE candidate events
    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          const callId = [caller.uid, receiver.uid].sort().join('-');
          const callDoc = doc(db, 'calls', callId);
          
          await updateDoc(callDoc, {
            candidates: arrayUnion(event.candidate.toJSON())
          });
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    };

    // Handle connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      switch(peerConnection.current.connectionState) {
        case 'connected':
          setCallStatus('connected');
          break;
        case 'disconnected':
        case 'failed':
          handleEndCall();
          break;
        default:
          break;
      }
    };
  }, [caller?.uid, receiver?.uid]);

  if (!isOpen) return null;

  return (
    <div className={`call-modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="call-modal">
        <div className="call-header">
          <h3>{isIncoming ? 'Incoming Call' : 'Calling...'}</h3>
          <span className="call-type">{callType === 'video' ? 'Video Call' : 'Voice Call'}</span>
        </div>

        <div className="call-content">
          <div className="user-info">
            <img 
              src={isIncoming ? caller?.photoURL : receiver?.photoURL || defaultAvatar} 
              alt="User" 
              className="call-avatar"
            />
            <h4>{isIncoming ? caller?.displayName : receiver?.displayName}</h4>
          </div>

          {callType === 'video' && (
            <div className="video-container">
              <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            </div>
          )}

          <div className="call-controls">
            {isIncoming && callStatus === 'ringing' ? (
              <>
                <button className="accept-call" onClick={handleAcceptCall}>
                  {callType === 'video' ? <IoVideocamOutline /> : <IoCallOutline />}
                  Accept
                </button>
                <button className="reject-call" onClick={handleEndCall}>
                  <IoCloseOutline />
                  Decline
                </button>
              </>
            ) : (
              <button className="end-call" onClick={handleEndCall}>
                <IoCloseOutline />
                {callStatus === 'ringing' ? 'Cancel' : 'End Call'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallModal; 