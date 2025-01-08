import { useState } from 'react';
import { 
  IoCloseOutline, 
  IoWalletOutline,
  IoStarOutline,
  IoTrendingUpOutline,
  IoGiftOutline,
  IoShareSocialOutline,
  IoCashOutline
} from 'react-icons/io5';
import '../styles/MonetizationModal.css';

function MonetizationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  const monetizationFeatures = [
    {
      icon: IoStarOutline,
      title: 'Creator Program',
      description: 'Join our exclusive program to earn from your content',
      status: 'Not Eligible',
      requirements: [
        'Verified account status',
        'Minimum 1000 followers',
        'At least 100 posts',
        'Active in the last 30 days',
        '90% positive engagement rate'
      ]
    },
    {
      icon: IoTrendingUpOutline,
      title: 'Promoted Posts',
      description: 'Boost your content reach and earn from promotions',
      status: 'Available',
      earnings: '$0.00'
    },
    {
      icon: IoGiftOutline,
      title: 'Virtual Gifts',
      description: 'Receive gifts from your supporters',
      status: 'Available',
      earnings: '$0.00'
    },
    {
      icon: IoShareSocialOutline,
      title: 'Referral Program',
      description: 'Earn by inviting new users to WiChat',
      status: 'Available',
      earnings: '$0.00'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="monetization-modal-overlay">
      <div className="monetization-modal">
        <div className="monetization-header">
          <h2>
            <IoWalletOutline className="header-icon" />
            Monetization
          </h2>
          <button className="close-button" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="monetization-content">
          {/* Overview Section with Withdraw Button */}
          <div className="monetization-overview">
            <div className="earnings-card">
              <h3>Total Earnings</h3>
              <div className="amount">$0.00</div>
              <p>Start earning by exploring the options below</p>
              <button 
                className="withdraw-button" 
                disabled={true}
                title="Minimum withdrawal amount: $10.00"
              >
                <IoCashOutline />
                Withdraw Funds
              </button>
              <div className="minimum-note">
                Minimum withdrawal: $10.00
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {monetizationFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <feature.icon className="feature-icon" />
                  <div className="feature-status">{feature.status}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.requirements && (
                  <div className="requirements">
                    <h4>Requirements:</h4>
                    <ul>
                      {feature.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {feature.earnings && (
                  <div className="feature-earnings">
                    <span>Earnings:</span>
                    <span className="amount">{feature.earnings}</span>
                  </div>
                )}
                <button className="feature-button">
                  {feature.status === 'Available' ? 'Get Started' : 'Learn More'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="monetization-footer">
          <p>Need help? Visit our <a href="#">Monetization Help Center</a></p>
        </div>
      </div>
    </div>
  );
}

export default MonetizationModal; 