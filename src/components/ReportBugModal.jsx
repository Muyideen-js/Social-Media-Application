import React, { useState } from 'react';
import { 
  IoCloseOutline, 
  IoBugOutline,
  IoAttachOutline,
  IoSendOutline
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  input: {
    padding: '12px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  textarea: {
    padding: '12px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical',
    outline: 'none'
  },
  select: {
    padding: '12px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  },
  attachButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: '#646cff',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '16px'
  }
};

function ReportBugModal({ isOpen, onClose }) {
  const [bugReport, setBugReport] = useState({
    title: '',
    type: 'bug',
    description: '',
    steps: '',
    device: '',
    attachment: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle bug report submission
    console.log('Bug report submitted:', bugReport);
    onClose();
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.5rem' }}>
            <IoBugOutline style={{ color: '#646cff' }} />
            Report a Bug
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

        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Issue Title</label>
            <input
              type="text"
              placeholder="Brief description of the issue"
              value={bugReport.title}
              onChange={(e) => setBugReport({...bugReport, title: e.target.value})}
              style={modalStyles.input}
              required
            />
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Issue Type</label>
            <select
              value={bugReport.type}
              onChange={(e) => setBugReport({...bugReport, type: e.target.value})}
              style={modalStyles.select}
            >
              <option value="bug">Bug</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Description</label>
            <textarea
              placeholder="Detailed description of the issue"
              value={bugReport.description}
              onChange={(e) => setBugReport({...bugReport, description: e.target.value})}
              style={modalStyles.textarea}
              required
            />
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Steps to Reproduce</label>
            <textarea
              placeholder="Step by step instructions to reproduce the issue"
              value={bugReport.steps}
              onChange={(e) => setBugReport({...bugReport, steps: e.target.value})}
              style={modalStyles.textarea}
            />
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Device & Browser Info</label>
            <input
              type="text"
              placeholder="e.g., Chrome 98 on Windows 10"
              value={bugReport.device}
              onChange={(e) => setBugReport({...bugReport, device: e.target.value})}
              style={modalStyles.input}
            />
          </div>

          <button type="button" style={modalStyles.attachButton}>
            <IoAttachOutline /> Attach Screenshot
          </button>

          <button type="submit" style={modalStyles.submitButton}>
            <IoSendOutline /> Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportBugModal; 