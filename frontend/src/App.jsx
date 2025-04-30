import React from 'react';
import Quotes from './sections/Quotes'; 
import Register from './components/register';
//import Profile from './components/profile';
//import Footer from './components/Footer';
//import Navbar from './components/Navbar';
function App() {
  return (
    <div>
        <Register />        
          <Quotes/>
        {/* <Route path="/profile/:userId" element={<Profile />} />*/}
             
    </div>
  );
}

export default App;