import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetError } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user, isAuthenticated } = useSelector((state) => state.users);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        let valid = true;

        if (!email) {
            setEmailError('Email is required');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!valid) return;

        const result = await dispatch(loginUser({ email, password }));

        if (result?.payload?.user?.id) {
            alert('Login successful!');
            navigate(`/profile/${result.payload.user.id}`);
        } else {
            alert('Login failed. Please check your credentials.');
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
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p className="error">{emailError}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <p className="error">{passwordError}</p>}
                </div>
                {error && <p className="error">{error.message || error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
