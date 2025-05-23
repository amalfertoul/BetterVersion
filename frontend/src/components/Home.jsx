import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Quotes from '../sections/Quotes';

const Home = () => {
    const userId = useSelector((state) => state.users.userId);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Home Page</h1>
            <p>hnaya aneayto n todolist w vision board diala + quote </p>
            <Quotes />
        </div>
    );
};

export default Home;