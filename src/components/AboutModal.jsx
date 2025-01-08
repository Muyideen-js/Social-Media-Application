import React from 'react';
import { 
  IoCloseOutline, 
  IoInformationCircleOutline,
  IoLogoGithub,
  IoGlobeOutline,
  IoMailOutline,
  IoHeartOutline
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
    backgroundColor: '#1a1a1a',
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
    marginBottom: '24px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  version: {
    display: 'inline-block',
    padding: '4px 8px',
    background: '#646cff',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '16px'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#646cff',
    textDecoration: 'none',
    padding: '8px 0',
    transition: 'opacity 0.3s ease'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '24px',
    fontSize: '14px'
  }
};

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.5rem' }}>
            <IoInformationCircleOutline style={{ color: '#646cff' }} />
            About WiChat
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div style={modalStyles.section}>
          <span style={modalStyles.version}>Version 1.0.0</span>
          <p style={{ lineHeight: '1.6', margin: '0 0 16px 0' }}>
            WiChat is a modern messaging platform designed to bring people together. Built with the latest technologies and a focus on user experience, privacy, and security.
          </p>
        </div>

        <div style={modalStyles.section}>
          <h3 style={{ margin: '0 0 16px 0', color: '#646cff' }}>Connect With Us</h3>
          <a href="https://github.com/wichat" target="_blank" rel="noopener noreferrer" style={modalStyles.link}>
            <IoLogoGithub /> GitHub Repository
          </a>
          <a href="https://wichat.com" target="_blank" rel="noopener noreferrer" style={modalStyles.link}>
            <IoGlobeOutline /> Official Website
          </a>
          <a href="mailto:support@wichat.com" style={modalStyles.link}>
            <IoMailOutline /> Contact Us
          </a>
        </div>

        <div style={modalStyles.footer}>
          <IoHeartOutline style={{ color: '#646cff' }} />
          Made with love by the WiChat Team
        </div>
      </div>
    </div>
  );
}

export default AboutModal; 