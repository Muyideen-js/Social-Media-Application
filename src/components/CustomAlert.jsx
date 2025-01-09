import { useEffect } from 'react';
import { IoCheckmarkCircleOutline, IoCloseOutline } from 'react-icons/io5';
import '../styles/CustomAlert.css';

function CustomAlert({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`custom-alert ${type}`}>
      <div className="alert-icon">
        {type === 'success' && <IoCheckmarkCircleOutline />}
      </div>
      <p className="alert-message">{message}</p>
      <button className="alert-close" onClick={onClose}>
        <IoCloseOutline />
      </button>
    </div>
  );
}

export default CustomAlert; 