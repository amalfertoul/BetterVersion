import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addImagesToTask, addTask } from "../redux/actions";
import ImageCard from "../components/ImageCard";

const sampleImages = [
  "https://source.unsplash.com/random/200x200?sig=1",
  "https://source.unsplash.com/random/200x200?sig=2",
  "https://source.unsplash.com/random/200x200?sig=3",
  "https://source.unsplash.com/random/200x200?sig=4",
];

const ImageGallery = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const saveImageToTask = (taskId, img) => {
    console.log("Saving Image:", img, "to Task:", taskId);
    dispatch(addImagesToTask(taskId, [img])); // Dispatch action
  };

  const createNewTask = () => {
    const newTaskTitle = prompt("Enter task title:");
    if (newTaskTitle) {
      const newTask = { id: Date.now(), title: newTaskTitle, completed: false, moodboard: [] };
      dispatch(addTask(newTask));
    }
  };

  return (
    <div className="image-gallery">
      <h2>Browse & Save Images</h2>
      <div className="image-grid">
        {sampleImages.map((img, index) => (
          <ImageCard key={index} img={img} tasks={tasks} onSave={saveImageToTask} onAddTask={createNewTask} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
