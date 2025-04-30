import React from 'react';
import Quotes from './sections/Quotes'; 
import Register from './components/register';
import Profile from './components/profile';
function App() {
  return (
    <div>
     <Quotes/> 
      <Register />
      <Profile />
    </div>
  );
}

export default App;