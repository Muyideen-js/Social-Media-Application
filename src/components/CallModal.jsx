import { useState, useEffect, useRef } from 'react';
import { IoCallOutline, IoVideocamOutline, IoCloseOutline, IoMicOutline, IoMicOffOutline, IoVideocamOffOutline } from 'react-icons/io5';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import '../styles/CallModal.css';

function CallModal({ isOpen, onClose, callType, caller, receiver, isIncoming = false }) {
  const [callStatus, setCallStatus] = useState('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const callDocRef = useRef(null);
  const cleanupRef = useRef(false);

  console.log('CallModal Props:', { 
    isOpen, 
    callType, 
    caller, 
    receiver, 
    isIncoming, 
    callStatus 
  });

  // Initialize WebRTC connection
  useEffect(() => {
    let mounted = true;
    cleanupRef.current = false;
    console.log('CallModal useEffect triggered:', { isOpen, caller, receiver });

    if (!isOpen || !caller?.uid || !receiver?.uid) {
      console.log('Missing required data, not initializing call');
      return;
    }

    const initializeCall = async () => {
      try {
        if (cleanupRef.current) return;
        console.log('Initializing call...');
        
        const callId = [caller.uid, receiver.uid].sort().join('-');
        callDocRef.current = doc(db, 'calls', callId);

        // Get user media before creating the call document
        const constraints = {
          audio: true,
          video: callType === 'video'
        };
        
        console.log('Getting user media...');
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted || cleanupRef.current) {
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

        if (!isIncoming && !cleanupRef.current) {
          console.log('Creating offer for outgoing call...');
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          // Create new call document for outgoing calls
          await setDoc(callDocRef.current, {
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
          
          setCallStatus('ringing');
        }

        console.log('Call initialized successfully');
      } catch (error) {
        console.error('Error initializing call:', error);
        if (mounted && !cleanupRef.current) {
          handleEndCall();
        }
      }
    };

    initializeCall();

    return () => {
      console.log('Cleanup function called');
      mounted = false;
      cleanupRef.current = true;
      cleanup();
    };
  }, [isOpen, callType, isIncoming, caller?.uid, receiver?.uid]);

  const cleanup = () => {
    console.log('Cleaning up resources...');
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  const handleEndCall = async () => {
    console.log('Ending call...');
    try {
      if (!caller?.uid || !receiver?.uid) return;

      if (callDocRef.current) {
        await updateDoc(callDocRef.current, {
          status: 'ended',
          endedAt: new Date(),
          endedBy: caller.uid
        });
      }

      cleanup();
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
      cleanup();
      onClose();
    }
  };

  const handleAcceptCall = async () => {
    try {
      const callId = [caller.uid, receiver.uid].sort().join('-');
      const callDoc = doc(db, 'calls', callId);
      
      // Get user media
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize RTCPeerConnection if not already done
      if (!peerConnection.current) {
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
      }

      // Get the current call data
      const callSnapshot = await getDoc(callDoc);
      if (!callSnapshot.exists()) {
        throw new Error('Call no longer exists');
      }
      
      const callData = callSnapshot.data();

      // Set remote description (offer)
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(callData.offer));

      // Create and set local description (answer)
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      // Update call document with answer and status
      await updateDoc(callDoc, {
        answer: {
          type: answer.type,
          sdp: answer.sdp
        },
        status: 'connected'
      });

      setCallStatus('connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      handleEndCall();
    }
  };

  // Add timer functionality
  useEffect(() => {
    if (callStatus === 'connected') {
      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  // Format duration to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get status message
  const getStatusMessage = () => {
    switch (callStatus) {
      case 'initializing':
        return 'Initializing...';
      case 'ringing':
        return isIncoming ? 'Incoming call...' : 'Ringing...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return callStatus;
    }
  };

  // Add this useEffect to listen for call status changes
  useEffect(() => {
    if (!caller?.uid || !receiver?.uid || !callDocRef.current) return;

    console.log('Setting up call status listener');
    
    const unsubscribe = onSnapshot(callDocRef.current, (snapshot) => {
      if (!snapshot.exists()) return;
      
      const callData = snapshot.data();
      console.log('Call status updated:', callData.status);
      
      if (callData.status === 'connected') {
        setCallStatus('connected');
        // Start the timer when call is connected
        startTimer();
      } else if (callData.status === 'ended') {
        handleEndCall();
      }
    });

    return () => unsubscribe();
  }, [caller?.uid, receiver?.uid]);

  // Add this function to start the timer
  const startTimer = () => {
    if (timerRef.current) return;
    
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  return (
    <div className={`call-modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="call-modal">
        <div className="call-header">
          <h3>{isIncoming ? 'Incoming Call' : 'Calling...'}</h3>
          <span className="call-type">
            {callType === 'video' ? 'Video Call' : 'Voice Call'}
          </span>
        </div>

        <div className="call-content">
          <div className="user-info">
            <img 
              src={isIncoming ? caller?.photoURL : receiver?.photoURL || defaultAvatar} 
              alt="User" 
              className="call-avatar"
            />
            <h4>{isIncoming ? caller?.displayName : receiver?.displayName}</h4>
            <div className={`call-status ${callStatus}`}>
              {getStatusMessage()}
            </div>
          </div>

          {callType === 'video' && (
            <div className="video-container">
              <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            </div>
          )}

          <div className="call-controls">
            {console.log('Rendering controls:', { isIncoming, callStatus })}
            {isIncoming ? (
              // Always show accept/reject for incoming calls
              <>
                <button 
                  className="accept-call" 
                  onClick={handleAcceptCall}
                >
                  <IoCallOutline />
                  Accept
                </button>
                <button 
                  className="reject-call" 
                  onClick={handleEndCall}
                >
                  <IoCloseOutline />
                  Decline
                </button>
              </>
            ) : (
              // Show end call button for outgoing calls
              <button 
                className="end-call" 
                onClick={handleEndCall}
              >
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