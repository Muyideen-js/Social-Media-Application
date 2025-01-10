import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { MdVerified, MdBusiness, MdStar } from 'react-icons/md';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Verification.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51O86YMEUexM9UyMhxVAK5Vds6PjdpfR9xZNN57k4hYqhR3afGmHPWe6Ua38ILJA41QZzWQ1QhsNdqhL0NZlWjOrx00A2uW56Qv');

const checkServices = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (!response.ok) {
      throw new Error('Server health check failed');
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error('Server is not ready');
    }
    return true;
  } catch (error) {
    console.error('Service check failed:', error);
    alert('Services are currently unavailable. Please try again later.');
    return false;
  }
};

function Verification() {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [planType, setPlanType] = useState('');

  const handleVerification = async (type) => {
    if (!(await checkServices())) {
      return;
    }
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Get current user info
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email;

      // Create checkout session
      const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: type,
          userId,
          userEmail
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
      }

      const { sessionId } = await response.json();
      console.log('Session created:', sessionId);

      // Redirect to checkout
      const result = await stripe.redirectToCheckout({
        sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async (type) => {
    try {
      // Get current user
      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      
      // Update user document with verification status
      await updateDoc(userRef, {
        verified: true,
        verificationType: type, // 'user' or 'business'
        verifiedAt: serverTimestamp()
      });

      // Verify the update worked by reading it back
      const updatedDoc = await getDoc(userRef);
      console.log('Updated user verification status:', updatedDoc.data());

      setPlanType(type);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  return (
    <div className="verification-container">
      <h1>Verification Plans</h1>
      
      <div className="verification-cards">
        {/* User Verification Card */}
        <div className="verification-card user-card">
          <div className="verification-header">
            <MdVerified className="verify-icon" />
            <h2>User Verification</h2>
          </div>

          <div className="verification-content">
            <div className="price">$4.99<span>/month</span></div>
            <ul>
              <li>
                <MdVerified className="list-icon" />
                <span>Blue Checkmark</span>
              </li>
              <li>
                <MdStar className="list-icon" />
                <span>Priority Search</span>
              </li>
              <li>
                <MdVerified className="list-icon" />
                <span>Basic Analytics</span>
              </li>
            </ul>

            <button 
              className="verify-button user-verify"
              onClick={() => handleVerification('user')}
              disabled={loading || auth.currentUser?.isVerified}
            >
              {loading ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        </div>

        {/* Business Verification Card */}
        <div className="verification-card business-card">
          <div className="verification-header">
            <MdBusiness className="verify-icon" />
            <h2>Business</h2>
            <span className="premium-badge">PRO</span>
          </div>

          <div className="verification-content">
            <div className="price">$9.99<span>/month</span></div>
            <ul>
              <li>
                <MdVerified className="list-icon gold" />
                <span>Gold Checkmark</span>
              </li>
              <li>
                <MdBusiness className="list-icon gold" />
                <span>Business Tools</span>
              </li>
              <li>
                <MdStar className="list-icon gold" />
                <span>Advanced Analytics</span>
              </li>
            </ul>

            <button 
              className="verify-button business-verify"
              onClick={() => handleVerification('business')}
              disabled={loading || auth.currentUser?.isBusinessVerified}
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verification; 