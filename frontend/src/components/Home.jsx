import React from 'react';
import Quotes from '../sections/Quotes';
import TodoListPage from '../sections/todolist';
const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Home Page</h1>
            <Quotes />
            <TodoListPage />
            
        </div>
    );
};

export default Home;