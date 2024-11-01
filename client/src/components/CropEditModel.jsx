import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import toast, { Toaster } from 'react-hot-toast';
import './style/cropedit.css';
import 'font-awesome/css/font-awesome.min.css';

const CropEditModal = ({ imageUrl, onSave, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const navigate = useNavigate();

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleAspectChange = (ratio) => {
        setAspect(ratio);
    };

    const saveCroppedImage = async () => {
        if (croppedAreaPixels) {
            const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
            onSave(croppedImage);
            toast.success("Image saved successfully!");
            navigate('/#media');
        } else {
            toast.error("No cropped area selected!");
        }
    };

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = new Image();
        image.src = imageSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const aspectRatios = [
        { label: "Free", value: null },
        { label: "Original", value: -1 },
        { label: "1:1", value: 1 },
        { label: "2:1", value: 2 },
        { label: "16:9", value: 16 / 9 },
        { label: "3:2", value: 3 / 2 },
        { label: "4:3", value: 4 / 3 },
        { label: "5:4", value: 5 / 4 },
    ];

    return (
        <div className="crop-modal-overlay" onClick={onClose}>
            <Toaster />
            <section className="crop-modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Crop & Edit Image</h2>
                    <div className="header-buttons">
                        <button className="close-modal" onClick={onClose}>&times;</button>
                    </div>
                </header>

                <div className="row crop-edit-body">
                    {/* Tool Panel */}
                    <div className="tool-panel col-lg-2 col-12">
                        <h3 className="tool-panel-title">Tools</h3>
                        <div className="tool-icons">
                            <div className="tool-icon active" title="Crop">
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4 4h16v16H4z" fill="#007bff" />
                                    <path d="M8 8h8v8H8z" fill="#ffffff" />
                                </svg>
                                <span className="tool-label">Crop</span>
                            </div>
                            <div className="tool-icon" title="Extend">
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4 12h16m-8 8v-16" stroke="#007bff" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="tool-label">Extend</span>
                            </div>
                            <div className="tool-icon" title="Adjust">
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4 6h16v12H4z" fill="#ffffff" />
                                    <circle cx="12" cy="12" r="6" fill="#007bff" />
                                </svg>
                                <span className="tool-label">Adjust</span>
                            </div>
                            <div className="tool-icon" title="Filter">
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4 4h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="#007bff" />
                                </svg>
                                <span className="tool-label">Filter</span>
                            </div>
                        </div>
                    </div>

                    {/* Aspect Ratio & Orientation Panel */}
                    <div className="ratio-panel col-lg-3 col-12">
                        <h3>Aspect Ratio</h3>
                        <div className="ratio-buttons">
                            {aspectRatios.map((ratio, index) => (
                                <button
                                    key={index}
                                    className={`ratio-button ${aspect === ratio.value ? 'active' : ''}`}
                                    onClick={() => handleAspectChange(ratio.value)}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>

                        <div className="orientation-section">
                            <h3 className="orientation-title">Orientation</h3>
                            <div className="orientation-icons">
                                <div
                                    className={`square-icon ${aspect === 1 ? 'active' : ''}`}
                                    title="Square"
                                    onClick={() => handleAspectChange(1)}
                                ></div>
                                <div
                                    className={`rectangle-icon ${aspect === 16 / 9 ? 'active' : ''}`}
                                    title="Rectangle"
                                    onClick={() => handleAspectChange(16 / 9)}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Image Cropper */}
                    <div className="crop-container col-lg-6 col-12">
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <button className="save-button" onClick={saveCroppedImage}>Save</button>

                </div>
            </section>
        </div>
    );
};

export default CropEditModal;
