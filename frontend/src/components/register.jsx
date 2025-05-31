import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetError, loginUser } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import '../style/Register.css'; // Assuming you have a CSS file for styling

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        // profile_picture: '',
    });
    
    const [errors, setErrors] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [isMounted, setIsMounted] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.users);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }
        
        // Full name validation
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full name is required';
            isValid = false;
        } else if (formData.fullname.length < 2) {
            newErrors.fullname = 'Please enter a valid name';
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const result = await dispatch(registerUser(formData)).unwrap();
            showSuccess('Registration successful!');
            
            // Automatically log in after successful registration
            const loginResult = await dispatch(loginUser({
                username: formData.username,
                password: formData.password
            })).unwrap();
            
            if (loginResult?.user?.id) {
                navigate('/profile');
            }
        } catch (error) {
            showError(error.message || 'Registration failed');
        }
    };

    useEffect(() => {
        return () => {
            dispatch(resetError());
        };
    }, [dispatch]);

    return (
        <div className="register-container">
            <div className={`register-form ${isMounted ? 'active' : ''}`}>
                <div className="form-header">
                    <h2>Create Account</h2>
                    <div className="header-decoration"></div>
                    <p>Join our community today</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className={`form-group ${errors.username ? 'error' : ''}`}>
                            <label htmlFor="username">Username</label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        
                        <div className={`form-group ${errors.fullname ? 'error' : ''}`}>
                            <label htmlFor="fullname">Full Name</label>
                            <input
                                name="fullname"
                                type="text"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                        </div>
                    </div>
                    
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-row">
                        <div className={`form-group ${errors.password ? 'error' : ''}`}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        
                        <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>
                    
                    {error && <div className="form-error">{error.message || error}</div>}
                    
                    <button type="submit" disabled={loading} className="register-btn">
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className="form-footer">
                    <p>Already have an account? <a href="/login">Sign In</a></p>
                </div>
            </div>
            
            <div className="register-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>
        </div>
    );
};

export default Register;