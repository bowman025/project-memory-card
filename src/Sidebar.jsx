import { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onDifficultySelect, onHome }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  const handleHomeClick = (callback) => {
    callback();
    setIsOpen(false);
  }

  const handleDiffClick = (n) => {
    onDifficultySelect(n);
    setIsOpen(false);
  }

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? '✕ Close' : '☰ Menu'}
      </button>
      {isOpen && (
        <div className="button-group">
          <button 
            className="menu-item menu-home" 
            onClick={() => handleHomeClick(onHome)}>
                Home
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
      )}
    </div>
  );
}

export default Sidebar;
