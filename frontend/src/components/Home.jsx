import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Quotes from '../sections/Quotes';
import TodoListPage from '../sections/todolist';
import FirstPage from './firstPage';

const Home = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return <FirstPage />;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Home Page</h1>
            <Quotes />
            <TodoListPage />
        </div>
    );
};

export default Home;