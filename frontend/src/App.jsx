import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Sidebar from './components/Sidebar';
import Register from './components/register';
import Login from './components/login';
import Explore from './components/explore';
import Games from './components/games';
import Home from './components/Home';
import Profile from './components/profile';
import FirstPage from './components/firstPage';
import Socialize from './components/socialize';
import RenderMessages from './sections/conversation';
import AdminOnly from './components/AdminOnly';
import VisionBoardDetail from './sections/VisionBoard';
import './style/App.css';

function App() {
  const userId = useSelector((state) => state.users.userId);

  return (
    <NotificationProvider>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/AdminOnly" element={<AdminOnly />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/games" element={<Games />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/socialize" element={<Socialize />} />
            <Route path="/conversation/:userId" element={<RenderMessages />} />
            <Route path="/vision-board/:id" element={<VisionBoardDetail />} />
          </Routes>
        </main>
      </div>
    </NotificationProvider>
  );
}

export default App;
