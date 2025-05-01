import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Register from './components/register';
import Login from './components/login';
import Explore from './components/explore';
import Chats from './components/chats';
import Games from './components/games';
import UserProfile from './components/profile';
import Home from './components/Home';
import FirstPage from './components/firstPage';

function App() {
  const userId = useSelector((state) => state.users.userId); // Replace with actual logic to get userId

  return (
    <>
      <Navbar userId={userId} />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/games" element={<Games />} />
        <Route path="/profile/:userId" element={<UserProfile userId={userId} />} />
      </Routes>
    </>
  );
}

export default App;
