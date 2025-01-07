import { 
  IoSettingsOutline, 
  IoColorPaletteOutline,
  IoShieldCheckmarkOutline,
  IoHelpCircleOutline,
  IoInformationCircleOutline,
  IoBugOutline
} from 'react-icons/io5';
import '../styles/More.css';

function More() {
  const menuItems = [
    {
      icon: IoSettingsOutline,
      title: 'Settings',
      description: 'Manage your account settings and preferences'
    },
    {
      icon: IoColorPaletteOutline,
      title: 'Display',
      description: 'Customize your view'
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: 'Privacy',
      description: 'Manage your privacy and security'
    },
    {
      icon: IoHelpCircleOutline,
      title: 'Help Center',
      description: 'Get help with using WiChat'
    },
    {
      icon: IoInformationCircleOutline,
      title: 'About',
      description: 'Learn more about WiChat'
    },
    {
      icon: IoBugOutline,
      title: 'Report a Bug',
      description: 'Help us improve WiChat'
    }
  ];

  return (
    <div className="more-container">
      <div className="more-header">
        <h2>More Options</h2>
      </div>
      
      <div className="menu-grid">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="menu-item">
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
  );
}

export default More; 