import React, { useState } from 'react';
import { 
  IoCloseOutline, 
  IoShieldCheckmarkOutline,
  IoEyeOutline,
  IoLockClosedOutline,
  IoNotificationsOutline,
  IoGlobeOutline,
  IoPersonOutline,
  IoKeyOutline
} from 'react-icons/io5';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
    backdropFilter: 'blur(5px)'
  },
  content: {
    backgroundColor: 'var(--bg-darker, #1a1a1a)',
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '16px'
  },
  section: {
    marginBottom: '24px'
  },
  option: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease'
  },
  select: {
    width: '100%',
    padding: '12px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px'
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  toggleInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  toggleText: {
    flex: 1
  },
  toggleTitle: {
    fontWeight: '500',
    marginBottom: '4px',
    color: 'white'
  },
  toggleDescription: {
    fontSize: '0.9em',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.4'
  },
  icon: {
    color: 'var(--primary-color, #646cff)',
    fontSize: '20px',
    flexShrink: 0
  },
  button: {
    background: 'var(--primary-color, #646cff)',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'background 0.3s ease'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '46px',
    height: '24px',
    flexShrink: 0
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  switchSlider: (isChecked) => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isChecked ? '#646cff' : '#2a2a2a',
    transition: 'all 0.4s ease',
    borderRadius: '34px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: isChecked ? '0 0 10px rgba(100, 108, 255, 0.4)' : 'none'
  }),
  switchHandle: (isChecked) => ({
    position: 'absolute',
    content: '""',
    height: '18px',
    width: '18px',
    left: isChecked ? '25px' : '3px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: 'all 0.4s ease',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  })
};

function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [accountPrivacy, setAccountPrivacy] = useState('public');
  const [messagePrivacy, setMessagePrivacy] = useState('everyone');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.5rem' }}>
            <IoShieldCheckmarkOutline style={modalStyles.icon} />
            Privacy & Security
          </h2>
          <button style={modalStyles.closeButton} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div style={modalStyles.section}>
          <h3 style={{ color: '#646cff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
            <IoGlobeOutline />
            Account Privacy
          </h3>
          <div style={modalStyles.option}>
            <select 
              value={accountPrivacy}
              onChange={(e) => setAccountPrivacy(e.target.value)}
              style={modalStyles.select}
            >
              <option value="public" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Public Account</option>
              <option value="private" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Private Account</option>
              <option value="custom" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Custom</option>
            </select>
          </div>
        </div>

        <div style={modalStyles.section}>
          <h3 style={{ color: '#646cff', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
            <IoPersonOutline />
            Message Privacy
          </h3>
          <div style={modalStyles.option}>
            <select 
              value={messagePrivacy}
              onChange={(e) => setMessagePrivacy(e.target.value)}
              style={modalStyles.select}
            >
              <option value="everyone" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Everyone</option>
              <option value="followers" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Followers Only</option>
              <option value="nobody" style={{ background: '#2a2a2a', color: 'white', padding: '8px' }}>Nobody</option>
            </select>
          </div>
        </div>

        {[
          { 
            icon: IoLockClosedOutline, 
            title: 'Two-Factor Authentication', 
            description: 'Add an extra layer of security',
            state: twoFactorEnabled,
            setState: setTwoFactorEnabled
          },
          { 
            icon: IoEyeOutline, 
            title: 'Activity Status', 
            description: 'Show when you\'re online',
            state: activityStatus,
            setState: setActivityStatus
          },
          { 
            icon: IoNotificationsOutline, 
            title: 'Read Receipts', 
            description: 'Show when you\'ve read messages',
            state: readReceipts,
            setState: setReadReceipts
          },
          { 
            icon: IoKeyOutline, 
            title: 'Data Sharing', 
            description: 'Personalize your experience',
            state: dataSharing,
            setState: setDataSharing
          }
        ].map((item, index) => (
          <div key={index} style={modalStyles.section}>
            <div style={modalStyles.option}>
              <div style={modalStyles.toggleContainer}>
                <div style={modalStyles.toggleInfo}>
                  <item.icon style={modalStyles.icon} />
                  <div style={modalStyles.toggleText}>
                    <div style={modalStyles.toggleTitle}>{item.title}</div>
                    <div style={modalStyles.toggleDescription}>{item.description}</div>
                  </div>
                </div>
                <label style={modalStyles.switch}>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={() => item.setState(!item.state)}
                    style={modalStyles.switchInput}
                  />
                  <span style={modalStyles.switchSlider(item.state)}>
                    <span style={modalStyles.switchHandle(item.state)} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}

        <div style={modalStyles.footer}>
          <button 
            style={{
              ...modalStyles.button,
              ':hover': {
                background: 'var(--primary-color-light, #7c5cff)'
              }
            }} 
            onClick={onClose}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal; 