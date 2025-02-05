import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './containers/Home'
import Navbar from './components/Navbar';

function App() {

  return (
    <>

      <Router>
        <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
