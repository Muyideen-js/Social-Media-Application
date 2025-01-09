import { MdVerified } from 'react-icons/md';
import '../styles/SuccessModal.css';

function SuccessModal({ isOpen, onClose, planType }) {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">
          <MdVerified />
        </div>
        <h2>Verification Successful!</h2>
        <p>
          {planType === 'business' 
            ? 'Your business account has been verified with a gold checkmark.'
            : 'Your account has been verified with a blue checkmark.'}
        </p>
        <button className="success-button" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;