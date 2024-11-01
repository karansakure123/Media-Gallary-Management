import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/navbar.css';
import MediaGallery from './mediaGallery';
import { useAuth } from '../authContext/authContext'; 

const Navbar = () => {
    const { user, logoutUser, loading } = useAuth(); 
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
    const [isMediaGalleryOpen, setMediaGalleryOpen] = useState(false);
    const navigate = useNavigate(); 

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 992);
        setIsOpen(window.innerWidth > 992);
    };

    const handleLogout = () => {
        logoutUser(); 
        navigate('/login'); 
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
                <div className="navbar-links">
                    {loading ? ( 
                        <span className="navbar-user">Loading...</span>
                    ) : (
                        <span className="navbar-user">Hello, {user?.username || 'User'}</span> // Safely access username
                    )}
                    <a href="#media" className="navbar-link" onClick={() => setMediaGalleryOpen(true)}>
                        Media
                    </a>
                    <button className="navbar-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <button
                className={`toggle-btn ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                onClick={toggleSidebar}
                style={{ display: isMobile ? 'block' : 'none' }}
            >
                ☰
            </button>

            <MediaGallery isOpen={isMediaGalleryOpen} onClose={() => setMediaGalleryOpen(false)} />
        </div>
    );
};

export default Navbar;
