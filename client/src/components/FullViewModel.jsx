import React from 'react';

const FullViewModal = ({ image, onClose }) => {
    return (
        <div className="full-view-overlay">
            <div className="full-view-modal">
                <button className="close-full-view" onClick={onClose}>X</button>
                <img src={image} alt="Full View" className="full-view-image" />
            </div>
        </div>
    );
};

export default FullViewModal;
