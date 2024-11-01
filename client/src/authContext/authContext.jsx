// authContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Decode JWT function
const decodeJwt = (token) => {
    const payload = token.split('.')[1]; // Get the payload part
    return JSON.parse(atob(payload));    // Decode Base64 payload
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) return; // Return early if no token found
            
            const response = await axios.get('http://localhost:4100/auth/mee', {
                headers: {
                    "Authorization": `Bearer ${token}`, // Include token in the header
                    "Content-Type": "application/json"
                },
                withCredentials: true, // Include cookies if necessary
            });
            
             setUser(response.data); // Set the user data in state
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error fetching user data:", error.response?.data || error.message); // Log error response
            logoutUser(); // Logout if the request fails
        }
    };

    // Call fetchUserData if token exists in local storage when component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                decodeJwt(token);  // Verify token validity
                fetchUserData();   // Fetch data only if token exists and is valid
            } catch (error) {
                console.error("Token decoding failed", error);
                logoutUser();
            }
        }
    }, []);

    // Login user function
    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:4100/auth/login', { username, password }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            localStorage.setItem('token', response.data.token); // Store the JWT token in localStorage
            await fetchUserData(); // Fetch user data after login
            return response.data;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    // Logout user function
    const logoutUser = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            setIsAuthenticated, 
            user, 
            setUser, 
            loginUser, 
            logoutUser, 
            fetchUserData 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
