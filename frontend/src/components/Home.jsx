import React from 'react';
import { useSelector } from 'react-redux';
import Quotes from '../sections/Quotes';
//import TodoListPage from '../sections/todo-list'; 

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Home Page</h1>
            <p>hnaya aneayto n todolist w vision board diala + quote </p>
            <Quotes />
            
        </div>
    );
};

export default Home;