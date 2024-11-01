import React from 'react';
import './style/saveimg.css';  

const SaveImg = ({ isOpen, onClose }) => {
  if (!isOpen) return null;  

  return (
    <div className="save-notify-overlay" onClick={onClose}>
      <div className="save-notify-content" onClick={(e) => e.stopPropagation()}>
        <header className="save-notify-header">
          <h2>Image Saved!</h2>
        </header>
        <div className="save-notify-body">
          <p>Your image has been successfully saved.</p>
        </div>
        <footer className="save-notify-footer">
          <button className="save-notify-close" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SaveImg;
