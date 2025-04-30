import React from 'react';
import Quotes from './sections/Quotes'; 
import Register from './components/register';
//import Profile from './components/profile';
//import Footer from './components/Footer';
function App() {
  return (
    <div>
        <Quotes/>
        <Register />
        {/* <Route path="/profile/:userId" element={<Profile />} />*/}
    </div>
  );
}

export default App;