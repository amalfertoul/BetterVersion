import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetError } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        password: '',
        // profile_picture: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.users);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (result.meta.requestStatus === 'fulfilled') {
            const userId = result.payload.id; // Assuming the payload contains the user ID
            alert('Registration successful! Please log in.');
            navigate(`/profile/${userId}`); // Redirect to the profile page after registration
        } else {
            alert('Registration failed. Please check your details and try again.');
        }
    };

    useEffect(() => {
        return () => {
            dispatch(resetError());
        };
    }, [dispatch]);

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Full Name:</label>
                    <input name="fullname" value={formData.fullname} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {/* <div>
                    <label>Profile Picture URL (optional):</label>
                    <input name="profile_picture" value={formData.profile_picture} onChange={handleChange} />
                </div> */}
                {error && <p className="error">{error.message || error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
