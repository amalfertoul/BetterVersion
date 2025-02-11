import React, { useState } from "react";

const ImageCard = ({ img, tasks, onSave, onAddTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");

  const handleSave = () => {
    if (!selectedTask) return;
    onSave(selectedTask, img); // Send selected task ID and image URL to parent
    setShowModal(false);
    setSelectedTask(""); // Reset selection
  };

  return (
    <div className="image-card">
      <img src={img} alt="preview" />
      <button onClick={() => setShowModal(true)}>Save</button>

      {showModal && (
        <div className="modal">
          <h3>Save to Task</h3>
          <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <button onClick={handleSave} disabled={!selectedTask}>
            ✅ Confirm
          </button>
          <button onClick={onAddTask}>➕ Add New Task</button>
          <button onClick={() => setShowModal(false)}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
