import { useState } from 'react';

function TabNavigation() {
  const [activeTab, setActiveTab] = useState('foryou');

  const tabs = [
    { id: 'foryou', label: 'For You' },
    { id: 'following', label: 'Following' },
    { id: 'followers', label: 'Followers' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // You can add additional logic here when tabs change
  };

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabNavigation; 