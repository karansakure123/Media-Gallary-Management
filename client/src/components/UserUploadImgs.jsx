import React, { useEffect, useState } from 'react';
import './style/useruploadimg.css';
import CropEditModal from './CropEditModel';
import FullViewModal from './FullViewModel';
import Loader from './Loader'; // Import the Loading component

const UserUploadImgs = ({ images }) => {
  const [notification, setNotification] = useState('');
  const [imageNames, setImageNames] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, index: null });
  const [showCropModal, setShowCropModal] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    if (images.length > 0) {
      // Set loading and delay display of images
      setLoading(true);
      setTimeout(() => {
        setCurrentImages(images);  // Update current images after delay
        setImageNames(images.map((img, index) => `Image ${index + 1}`));
        setNotification('Image Uploaded Successfully ✔️');
        setLoading(false);
        setShowNotification(true);
      }, 3000); // 3-second delay
    } else {
      setNotification('Error: No images uploaded yet.');
      setShowNotification(true);
      setLoading(false);
    }
  }, [images]);

  const closeNotification = () => setShowNotification(false);

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY - 50 },
      index: index,
    });
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowFullModal(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCropEditClick = (img) => {
    setSelectedImage(img);
    setShowCropModal(true);
  };

  const handleSaveEditedImage = (editedImage, index) => {
    const updatedImages = [...currentImages];
    updatedImages[index] = editedImage;
    setCurrentImages(updatedImages);
    setShowCropModal(false);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowFullModal(false);
    setShowCropModal(false);
  };

  return (
    <div className="user-upload-images" onClick={() => setContextMenu({ ...contextMenu, visible: false })}>
      
      <h3 className="uploaded-name">Uploaded Images</h3>
      <div className="row">
        {loading ? (
          // Show loader while loading is true
          <div className="loader">  <Loader /></div>
        ) : currentImages.length > 0 ? (
          currentImages.map((img, index) => (
            <div
              className="col-md-4 col-sm-6 gallery-item"
              key={index}
              onContextMenu={(e) => handleContextMenu(e, index)}
              style={{ position: 'relative' }}
            >
              <img
                src={img}
                alt={`Uploaded img ${index}`}
                className="custom-image"
                onClick={() => handleImageClick(img)}
              />
              
              {/* Context Menu */}
              {contextMenu.visible && contextMenu.index === index && (
                <div
                  className="context-menu"
                  style={{
                    position: 'absolute',
                    top: contextMenu.position.y,
                    left: contextMenu.position.x,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <p style={{ color: 'black', margin: '3px 0', fontWeight: 'bold' }}>Image Options:</p>
                  <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Add to Board</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Rename</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }} onClick={() => handleCropEditClick(img)}>Crop & Edit</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Cut Out Background</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Preview</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Space</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Move to...</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Copy URL</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Download</li>
                    <li style={{ marginBottom: '4px', cursor: 'pointer' }}>Move to Trash</li>
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <button className="close-btn" onClick={closeNotification}>
              &times;
            </button>
            <p className="upload-completed">{notification}</p>
            <div className="uploaded-names">
              {imageNames.map((name, index) => (
                <p key={index}>
                  {name}
                  <svg className="tick-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21 7L9 19l-5-5" />
                  </svg>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFullModal && (
        <FullViewModal image={selectedImage} onClose={closeModal} />
      )}

      {showCropModal && (
        <CropEditModal
          imageUrl={selectedImage}
          onSave={(editedImage) => handleSaveEditedImage(editedImage, contextMenu.index)}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UserUploadImgs;














 