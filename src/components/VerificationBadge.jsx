import { IoCheckmarkCircle } from 'react-icons/io5';
import '../styles/VerificationBadge.css';

export function VerificationBadge({ type = 'user' }) {
  console.log('Rendering verification badge with type:', type);
  
  return (
    <span className={`verification-badge ${type}`}>
      <IoCheckmarkCircle />
    </span>
  );
} 