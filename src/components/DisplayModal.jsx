import { useState, useEffect } from 'react';
import { 
  IoCloseOutline, 
  IoColorPaletteOutline,
  IoContrastOutline,
  IoTextOutline,
  IoGridOutline
} from 'react-icons/io5';
import '../styles/DisplayModal.css';

function DisplayModal({ isOpen, onClose }) {
  const [primaryColor, setPrimaryColor] = useState('#646cff');
  const [fontSize, setFontSize] = useState('medium');
  const [density, setDensity] = useState('comfortable');
  const [contrast, setContrast] = useState('normal');

  const colors = [
    { name: 'Purple', value: '#646cff' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' }
  ];

  const handleColorChange = (color) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('primaryColor', color);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('fontSize', size);
  };

  if (!isOpen) return null;

  return (
    <div className="display-modal-overlay">
      <div className="display-modal">
        <div className="display-header">
          <h2>
            <IoColorPaletteOutline className="header-icon" />
            Display
          </h2>
          <button className="close-button" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="display-content">
          {/* Color Theme */}
          <div className="display-section">
            <h3>Color Theme</h3>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`color-button ${primaryColor === color.value ? 'active' : ''}`}
                  style={{ '--color': color.value }}
                  onClick={() => handleColorChange(color.value)}
                >
                  <span className="color-circle"></span>
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="display-section">
            <h3>
              <IoTextOutline className="section-icon" />
              Font Size
            </h3>
            <div className="font-size-options">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  className={`font-size-button ${fontSize === size ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange(size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="display-section">
            <h3>
              <IoGridOutline className="section-icon" />
              Density
            </h3>
            <div className="density-options">
              {['comfortable', 'cozy', 'compact'].map((option) => (
                <button
                  key={option}
                  className={`density-button ${density === option ? 'active' : ''}`}
                  onClick={() => setDensity(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div className="display-section">
            <h3>
              <IoContrastOutline className="section-icon" />
              Contrast
            </h3>
            <div className="contrast-options">
              {['normal', 'high', 'low'].map((option) => (
                <button
                  key={option}
                  className={`contrast-button ${contrast === option ? 'active' : ''}`}
                  onClick={() => setContrast(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="display-footer">
          <button className="reset-button" onClick={() => {
            handleColorChange('#646cff');
            handleFontSizeChange('medium');
            setDensity('comfortable');
            setContrast('normal');
          }}>
            Reset to Default
          </button>
          <button className="save-button" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayModal; 