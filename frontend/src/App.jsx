import React from 'react';
import Quotes from './sections/Quotes'; // Assuming Quotes is in the same directory
import Register from './components/register';
function App() {
  return (
    <div>
      <Quotes />
      <Register />
      {/* Other components can be added here */}
    </div>
  );
}

export default App;