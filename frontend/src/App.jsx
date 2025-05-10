import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Register from './components/register';
import Login from './components/login';
import Explore from './components/explore';
import Games from './components/games';
import Home from './components/Home';
import Profile from './components/profile';
import FirstPage from './components/firstPage';
import TodoList from './sections/todolist';
function App() {
  const userId = useSelector((state) => state.users.userId);

  return (
    <>
      <Navbar userId={userId} />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/games" element={<Games />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/todolist" element={<TodoList />} />
        {/* Add other routes here */}

      </Routes>
    </>
  );
}

export default App;
