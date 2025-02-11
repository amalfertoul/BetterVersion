import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Provider } from "react-redux";
import store from "./redux/store";
import MoodboardPage from "./containers/MoodBoardPage";
import ImageGallery from "./containers/ImageGallery";
import "./styles/app.css";

import TasksPage from "./containers/TasksPage";
import StarButton from "./components/StarButton";
import Bookmark from "./components/Bookmark";



const App = () => {

  return (
    <Provider store={store}>
      <Router>   
        <Navbar/>
        <StarButton>Click Me</StarButton>
        <Bookmark />
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/gallery" element={<ImageGallery />} />
          <Route path="/moodboard/:taskId" element={<MoodboardPage />} />
         
            
        </Routes>

      </Router>
      
    </Provider>
  );
};

export default App;
