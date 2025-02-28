import React, { useState, useRef } from "react";
import { format } from "date-fns";

const priorityColors = {
  High: "#ff4c4c",
  Medium: "#ffa500",
  Low: "#4caf50",
};

function TaskList({ task, tasks, setTasks }) {
  const [isEditing, setIsEditing] = useState(task.isEditing || false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDueDate, setNewDueDate] = useState(task.dueDate);
  const editRef = useRef(null);

  // Save task changes
  const handleSave = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, title: newTitle, dueDate: newDueDate, isEditing: false } : t
    );
    setTasks(updatedTasks);
    setIsEditing(false);
  };

  // Track if clicking outside the editing area
  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      handleSave();
    }
  };

  // Attach event listener to detect outside clicks
  React.useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  return (
    <div className="task">
      {isEditing ? (
        <div ref={editRef} className="task-edit-container">
          <input
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()} // ✅ Prevents closing on calendar click
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <>
          <div className="task-info" onDoubleClick={() => setIsEditing(true)}> {/* ✅ Double-click to edit */}
            <span className="task-title">{task.title}</span>
            <span className="task-date">{format(new Date(task.dueDate), "yyyy-MM-dd")}</span>
          </div>
          <div className="priority-indicator">
            <span className="led" style={{ backgroundColor: priorityColors[task.priority] }} />
          </div>
        </>
      )}
    </div>
  );
}

export default TaskList;
