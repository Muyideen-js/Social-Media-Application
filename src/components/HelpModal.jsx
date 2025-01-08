import React, { useState } from 'react';
import { 
  IoCloseOutline, 
  IoHelpCircleOutline,
  IoSearchOutline,
  IoChevronForwardOutline,
  IoMailOutline,
  IoBookmarkOutline,
  IoChatboxOutline,
  IoShieldOutline,
  IoSettingsOutline,
  IoWalletOutline
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
  searchContainer: {
    position: 'relative',
    marginBottom: '24px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#646cff',
    fontSize: '20px'
  },
  section: {
    marginBottom: '24px'
  },
  helpItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  itemIcon: {
    color: '#646cff',
    fontSize: '24px',
    marginRight: '16px'
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    fontWeight: '500',
    marginBottom: '4px'
  },
  itemDescription: {
    fontSize: '0.9em',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  arrowIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '20px'
  }
};

const helpItems = [
  {
    icon: IoChatboxOutline,
    title: 'Getting Started',
    description: 'Learn the basics of using WiChat'
  },
  {
    icon: IoShieldOutline,
    title: 'Account Security',
    description: 'Keep your account safe and secure'
  },
  {
    icon: IoSettingsOutline,
    title: 'Account Settings',
    description: 'Manage your account preferences'
  },
  {
    icon: IoWalletOutline,
    title: 'Payments & Billing',
    description: 'Learn about payments and subscriptions'
  },
  {
    icon: IoBookmarkOutline,
    title: 'Features Guide',
    description: 'Discover all WiChat features'
  },
  {
    icon: IoMailOutline,
    title: 'Contact Support',
    description: 'Get help from our support team'
  }
];

function HelpModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredItems = helpItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.5rem' }}>
            <IoHelpCircleOutline style={{ color: '#646cff' }} />
            Help Center
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

        <div style={modalStyles.searchContainer}>
          <IoSearchOutline style={modalStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={modalStyles.searchInput}
          />
        </div>

        <div style={modalStyles.section}>
          {filteredItems.map((item, index) => (
            <div key={index} style={modalStyles.helpItem}>
              <item.icon style={modalStyles.itemIcon} />
              <div style={modalStyles.itemContent}>
                <div style={modalStyles.itemTitle}>{item.title}</div>
                <div style={modalStyles.itemDescription}>{item.description}</div>
              </div>
              <IoChevronForwardOutline style={modalStyles.arrowIcon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HelpModal; 