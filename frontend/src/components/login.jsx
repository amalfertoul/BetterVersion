import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetError } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();

    const { loading, error, user, isAuthenticated } = useSelector((state) => state.users);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        let valid = true;

        if (!username) {
            setUsernameError('Username is required');
            valid = false;
        } else {
            setUsernameError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!valid) return;

        const result = await dispatch(loginUser({ username, password }));

        if (result?.payload?.user?.id) {
            showSuccess('Login successful!');
            navigate('/profile');
        } else {
            showError('Login failed. Please check your credentials.');
        }
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            navigate(`/profile/${user.id}`);
        }
    }, [isAuthenticated, user, navigate]);

    // Reset error on unmount
    useEffect(() => {
        return () => {
            dispatch(resetError());
        };
    }, [dispatch]);

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={usernameError ? 'error' : ''}
                    />
                    {usernameError && <span className="error-message">{usernameError}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={passwordError ? 'error' : ''}
                    />
                    {passwordError && <span className="error-message">{passwordError}</span>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
