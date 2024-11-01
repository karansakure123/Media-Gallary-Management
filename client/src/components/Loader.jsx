import React from 'react';
import './style/loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        {/* Custom loader icon */}
        <svg className="loader-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle className="loader-circle" cx="32" cy="32" r="30" />
          <path className="loader-path" d="M32 2v10M32 62v-10M62 32h-10M2 32h10" />
        </svg>
        <div className="loader-text"> Uploading ...</div>
      </div>
    </div>
  );
};

export default Loader;
