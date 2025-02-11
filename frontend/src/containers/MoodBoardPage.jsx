import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MoodboardPage = () => {
  const { taskId } = useParams();
  const task = useSelector(state => state.tasks.find(t => t.id.toString() === taskId));

  if (!task) return <p>Task not found.</p>;

  return (
    <div className="moodboard-page">
      <h2>{task.title} - Moodboard</h2>
      <div className="moodboard-gallery">
        {task.moodboard.map((img, index) => (
          <img key={index} src={img} alt={`Moodboard ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default MoodboardPage;
