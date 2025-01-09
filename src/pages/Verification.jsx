import { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { MdVerified, MdBusiness, MdStar } from 'react-icons/md';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/Verification.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51O86YMEUexM9UyMhxVAK5Vds6PjdpfR9xZNN57k4hYqhR3afGmHPWe6Ua38ILJA41QZzWQ1QhsNdqhL0NZlWjOrx00A2uW56Qv');

function Verification({ user }) {
  const [loading, setLoading] = useState(false);

  const handleVerification = async (type) => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Call your backend API to create a Stripe Checkout session
      const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          planType: type,
          userEmail: user.email,
          userName: user.displayName
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
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
            <h2>User</h2>
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
              disabled={loading || user?.isVerified}
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
              disabled={loading || user?.isBusinessVerified}
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