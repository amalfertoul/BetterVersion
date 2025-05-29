import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Quotes from '../sections/Quotes';
import TodoListPage from '../sections/todolist';
import FirstPage from './firstPage';
import '../style/home.css';

const Home = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
    const user = useSelector((state) => state.users.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return <FirstPage />;
    }

    return (
        <div className="home-container">
            <div className="home-welcome">
                <h1>Welcome{user?.username ? `, ${user.username}` : ''}!</h1>
            </div>
            <div className="home-content">
                <div className="home-section">
                    <Quotes />
                </div>
                <div className="home-section">
                    <TodoListPage />
                </div>
            </div>
        </div>
    );
};

export default Home;