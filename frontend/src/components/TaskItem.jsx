import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTask, deleteTask } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const TaskItem = ({ task }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-header">
                <span>{task.title}</span>
                <button className="check-btn" onClick={() => dispatch(toggleTask(task.id))}>
                    {task.completed ? "❌" : "✔️"}
                </button>
                <button className="check-btn" onClick={() => dispatch(deleteTask(task.id))}>🗑️</button>
                <button className="info-btn" onClick={() => setIsOpen(!isOpen)}>ℹ️</button>
            </div>

            {isOpen && (
                <div className="task-details">
                    <p><strong>Details:</strong> {task.details || "No details available."}</p>
                    <div className="moodboard">
                        <h4>Moodboard:</h4>
                        <div className="moodboard-gallery">
                            {task.moodboard.slice(0, 3).map((img, index) => (
                                <img key={index} src={img} alt={`Moodboard ${index}`} 
                                         onClick={() => navigate(`/moodboard/${task.id}`)} />
                            ))}
                            {task.moodboard.length > 3 && (
                                <button onClick={() => navigate(`/moodboard/${task.id}`)}>View all</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
