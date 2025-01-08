import { useState } from 'react';
import { 
  IoSettingsOutline, 
  IoColorPaletteOutline,
  IoShieldCheckmarkOutline,
  IoHelpCircleOutline,
  IoInformationCircleOutline,
  IoBugOutline,
  IoWalletOutline,
  IoBriefcaseOutline
} from 'react-icons/io5';
import SettingsModal from '../components/SettingsModal';
import DisplayModal from '../components/DisplayModal';
import MonetizationModal from '../components/MonetizationModal';
import JobsModal from '../components/JobsModal';
import PrivacyModal from '../components/PrivacyModal';
import HelpModal from '../components/HelpModal';
import AboutModal from '../components/AboutModal';
import ReportBugModal from '../components/ReportBugModal';
import '../styles/More.css';

function More() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);

  const handlePrivacyClick = () => {
    console.log('Privacy clicked, current state:', isPrivacyOpen);
    setIsPrivacyOpen(true);
    console.log('Privacy state after set:', isPrivacyOpen);
  };

  const menuItems = [
    {
      icon: IoSettingsOutline,
      title: 'Settings',
      description: 'Manage your account settings and preferences',
      onClick: () => setIsSettingsOpen(true)
    },
    {
      icon: IoColorPaletteOutline,
      title: 'Display',
      description: 'Customize your view',
      onClick: () => setIsDisplayOpen(true)
    },
    {
      icon: IoWalletOutline,
      title: 'Monetization',
      description: 'Explore ways to earn from your content',
      onClick: () => setIsMonetizationOpen(true)
    },
    {
      icon: IoBriefcaseOutline,
      title: 'Jobs',
      description: 'Find opportunities and career connections',
      onClick: () => setIsJobsOpen(true)
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: 'Privacy',
      description: 'Manage your privacy and security',
      onClick: handlePrivacyClick
    },
    {
      icon: IoHelpCircleOutline,
      title: 'Help Center',
      description: 'Get help with WiChat',
      onClick: () => setIsHelpOpen(true)
    },
    {
      icon: IoInformationCircleOutline,
      title: 'About',
      description: 'Learn more about WiChat',
      onClick: () => setIsAboutOpen(true)
    },
    {
      icon: IoBugOutline,
      title: 'Report a Bug',
      description: 'Help us improve WiChat',
      onClick: () => setIsReportBugOpen(true)
    }
  ];

  console.log('Rendering More component, isPrivacyOpen:', isPrivacyOpen);

  return (
    <>
      <div className="more-container">
        <div className="more-header">
          <h2>More Options</h2>
        </div>
        
        <div className="menu-grid">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="menu-item" onClick={item.onClick}>
                <div className="menu-icon">
                  <Icon />
                </div>
                <div className="menu-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PrivacyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => {
          console.log('Closing privacy modal');
          setIsPrivacyOpen(false);
        }} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      <DisplayModal 
        isOpen={isDisplayOpen} 
        onClose={() => setIsDisplayOpen(false)} 
      />
      <MonetizationModal 
        isOpen={isMonetizationOpen} 
        onClose={() => setIsMonetizationOpen(false)} 
      />
      <JobsModal 
        isOpen={isJobsOpen} 
        onClose={() => setIsJobsOpen(false)} 
      />
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
      <ReportBugModal 
        isOpen={isReportBugOpen} 
        onClose={() => setIsReportBugOpen(false)} 
      />
    </>
  );
}

export default More; 