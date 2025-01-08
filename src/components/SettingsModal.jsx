import { useState } from 'react';
import { IoCloseOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import '../styles/SettingsModal.css';

function SettingsModal({ isOpen, onClose }) {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="settings-content">
          {/* Theme Settings */}
          <div className="settings-section">
            <h3>Theme</h3>
            <div className="theme-options">
              <button 
                className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <IoSunnyOutline />
                Light
              </button>
              <button 
                className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <IoMoonOutline />
                Dark
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="setting-option">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Enable Notifications</span>
            </div>
          </div>

          {/* Language Settings */}
          <div className="settings-section">
            <h3>Language</h3>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Font Size Settings */}
          <div className="settings-section">
            <h3>Font Size</h3>
            <div className="font-size-options">
              <button 
                className={`font-size-button ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => setFontSize('small')}
              >
                Small
              </button>
              <button 
                className={`font-size-button ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => setFontSize('medium')}
              >
                Medium
              </button>
              <button 
                className={`font-size-button ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => setFontSize('large')}
              >
                Large
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="save-button" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal; 