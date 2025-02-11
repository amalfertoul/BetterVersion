import React, { useState } from "react";
import Tabs from "../components/Tabs";
import TaskList from "../components/TaskList";
import AddTaskForm from "../components/AddTaskForm";
import "../styles/tasks.css";

const TasksPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="tasks-page">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AddTaskForm />
      <TaskList activeTab={activeTab}/>

    </div>
  );
};

export default TasksPage;




