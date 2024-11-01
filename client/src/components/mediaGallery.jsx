import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import './style/mediagallary.css';
import UserUploadImgs from './UserUploadImgs';
import CropEditModal from './CropEditModel';
import FullViewModal from './FullViewModel'; 

const MediaGallery = ({ isOpen, onClose }) => {
  const [mediaList, setMediaList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUpdateLoading, setImageUpdateLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [imageType, setImageType] = useState('');
  const [category, setCategory] = useState('');
  const [orientation, setOrientation] = useState('');
  const [color, setColor] = useState('');
  const [isFullViewOpen, setIsFullViewOpen] = useState(false); // State for full view modal

  // Fetch media images from the API
  const fetchMedia = async (query) => {
    if (!query) {
      setNotification('Please enter a search term');
      return;
    }

    setLoading(true);
    setNotification('');

    try {
      const apiKey = 'AIzaSyAYGT7qC4OLQxB323xSdumhqgFOdVTjbCQ'; // Replace with your actual API key
      const searchEngineId = '64c19e5972d9240f8'; // Replace with your actual Search Engine ID
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${searchEngineId}&searchType=image&key=${apiKey}`
      );

      if (response.data.items && response.data.items.length > 0) {
        setMediaList(response.data.items);
      } else {
        setMediaList([]);
        setNotification('No images found');
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setNotification('Error fetching media files');
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    setUploadedImages((prevImages) => [...prevImages, imgUrl]);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setMediaList([]);
      setNotification('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedia(searchQuery);
  };

  const handleDropdownChange = (e, setType) => {
    const selectedType = e.target.value;
    setType(selectedType);

    // Fetch media based on selected image type
    if (selectedType) {
      fetchMedia(selectedType);
    }
  };


    const openEditModal = (image) => {
        setSelectedImage(image);
        setIsEditOpen(false);
    };
  const handleSaveEditedImage = async (editedImage) => {
    setImageUpdateLoading(true);

    // Simulate a network request for saving the edited image
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

    // Update the uploaded images with the edited image
    setUploadedImages((prevImages) => {
      return prevImages.map((img) => (img === selectedImage ? editedImage : img));
    });

    setIsEditOpen(false);
    setImageUpdateLoading(false);
    setNotification('Image updated successfully!');
  };

  if (!isOpen) {
    return null;
  }
 
const handleRightClick = (event, image) => {
    event.preventDefault();
    setSelectedImage(image);
    setIsEditOpen(true); // CropEditModal open
};
 

  return (
    <div className="media-modal-overlay">
      <div className="media-modal">
        <div className="modal-header">
          <h2>Media Gallery</h2>
          <button className="close-modal" onClick={onClose}>X</button>
        </div>

        <div className="row model-row">

        
          <div className="col-lg-2 col-12 ">
            <div className="navbar-upload ">
              <label htmlFor="file-upload" className="upload-label">
                Upload Media <FaUpload />
              </label>
              <input
                type="file"
                id="file-upload"
                className="file-input"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="col-9">
            {notification && <div className="notification">{notification}</div>}
            {loading && (
              <div className="loader-overlay">
                <div className="loader"></div>
              </div>
            )}
            {imageUpdateLoading && (
              <div className="loader-overlay">
                <div className="loader">Updating...</div>
              </div>
            )}

            <form onSubmit={handleSearchSubmit} className="modal-search">
              <input
                type="text"
                className="search-bar"
                placeholder="Search media..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <button type="submit"> </button>
            </form>

            <div className="row mt-2">
              {/* Image Type Dropdown */}
              <div className="col-md-3">
                <div className="custom-dropdown ">
                  <select
                    name="imageType"
                    className="form-select custom-select "
                    value={imageType}
                    onChange={(e) => handleDropdownChange(e, setImageType)}
                  >
                    <option value="">Images</option>
                    <option value="Photo">Photo</option>
                    <option value="Clipart">Clipart</option>
                    <option value="Lineart">Lineart</option>
                  </select>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="col-md-3">
                <div className="custom-dropdown">
                  <select
                    name="category"
                    className="form-select custom-select"
                    value={category}
                    onChange={(e) => handleDropdownChange(e, setCategory)}
                  >
                    <option value="">All Categories</option>
                    <option value="Nature">Nature</option>
                    <option value="Technology">Technology</option>
                    <option value="Animals">Animals</option>
                    <option value="Architecture">Architecture</option>
                    <option value="People">People</option>
                    {/* Add more categories as needed */}
                  </select>
                </div>
              </div>

              {/* Orientation Dropdown */}
              <div className="col-md-3">
                <div className="custom-dropdown">
                  <select
                    name="orientation"
                    className="form-select custom-select"
                    value={orientation}
                    onChange={(e) => handleDropdownChange(e, setOrientation)}
                  >
                    <option value=""> Orientation</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Square">Square</option>
                  </select>
                </div>
              </div>

              {/* Color Dropdown */}
              <div className="col-md-3">
                <div className="custom-dropdown">
                  <select
                    name="color"
                    className="form-select custom-select"
                    value={color}
                    onChange={(e) => handleDropdownChange(e, setColor)}
                  >
                    <option value="">  Color</option>
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    {/* Add more colors as needed */}
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              {mediaList.length > 0 ? (
                mediaList.map((media) => (
                  <div className="col-md-4 col-6 gallery-item" key={media.link}>
                    <img
                      src={media.link}
                      alt={media.title}
                      className="img-fluid"
                          />
                  </div>
                ))
              ) : (
                <p className='no-media'>No media available.</p>
              )}
              <UserUploadImgs images={uploadedImages} />
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
                    <CropEditModal
                        image={selectedImage}
                        onSave={handleSaveEditedImage}
                        onClose={() => setIsEditOpen(false)}
                    />
                )}

       {isFullViewOpen && (
                    <FullViewModal 
                        image={selectedImage}
                        onClose={closeFullView}
                    />
                )}
    </div>
  );
};

export default MediaGallery;

