import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/actions";

const AddTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("daily");
  const [taskDetails, setTaskDetails] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      category: taskCategory,
      completed: false,
      details: taskDetails,
      moodboard: [], // No images added at this stage
    };

    dispatch(addTask(newTask));
    setTaskTitle("");
    setTaskDetails("");
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={taskTitle} 
        onChange={(e) => setTaskTitle(e.target.value)} 
        placeholder="Task title..." 
      />
      <textarea 
        value={taskDetails} 
        onChange={(e) => setTaskDetails(e.target.value)} 
        placeholder="Task details (optional)..." 
      />
      <select value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTaskForm;
