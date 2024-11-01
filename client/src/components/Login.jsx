import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../authContext/authContext';
import "./style/login.css"; 

const Login = () => {
    const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
    const [username, setUsername] = useState("");   
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, [setIsAuthenticated]);

    // Decode JWT function
    const decodeJwt = (token) => {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    };

    // Login function
    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:4100/auth/login', { username, password }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            localStorage.setItem('token', response.data.token);
            const decodedUser = decodeJwt(response.data.token);  
            setIsAuthenticated(true);
            setUser(decodedUser);
            return response.data;
        } catch (error) {
            console.error("Login failed", error);
            toast.error("Login failed. Please try again.");
            throw error;
        }
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(username, password);
            navigate('/'); // Redirect to home page on successful login
        } catch (error) {
            console.error("Error during login", error);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
            <span>Not registered? <a href="/register">Register here</a></span>
        </div>
    );
};

export default Login;
