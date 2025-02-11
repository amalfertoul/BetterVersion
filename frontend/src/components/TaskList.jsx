import React from "react";
import { useSelector } from "react-redux";
import TaskItem from "./TaskItem";

const TaskList = ({ activeTab }) => {
  const tasks = useSelector(state => state.tasks);
  const filteredTasks = activeTab === "all" ? tasks : tasks.filter(task => task.category === activeTab);

  return (
    <div className="task-list">
      {filteredTasks.length === 0 ? <p>No tasks available.</p> : 
        filteredTasks.map(task => <TaskItem key={task.id} task={task} />)}
    </div>
  );
};

export default TaskList;




