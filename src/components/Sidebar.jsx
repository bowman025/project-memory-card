import { useState, useEffect, useRef } from 'react';
import '../css/Sidebar.css';
import InfoModal from './Modal';

const Sidebar = ({ onDifficultySelect, onHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  const handleHomeClick = (callback) => {
    callback();
    setIsOpen(false);
  }

  const handleInfoClick = () => {
    setIsInfoOpen(true);
    setIsOpen(false);
  }

  const handleDiffClick = (n) => {
    onDifficultySelect(n);
    setIsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? '✕ Close' : '☰ Menu'}
      </button>
        <div className={`button-group ${isOpen ? 'open' : ''}`}>
          <button 
            className="menu-item menu-home" 
            onClick={() => handleHomeClick(onHome)}>
                Home
          </button>
          <button 
            className="menu-item menu-info" 
            onClick={() => handleInfoClick()}>
                Info
          </button>
          <button 
            className="menu-item menu-easy" 
            onClick={() => handleDiffClick(8)}>
                Easy
          </button>
          <button 
            className="menu-item menu-normal" 
            onClick={() => handleDiffClick(15)}>
                Normal
          </button>
          <button 
            className="menu-item menu-hard" 
            onClick={() => handleDiffClick(24)}>
                Hard
          </button>
        </div>
        <InfoModal 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}

export default Sidebar;
