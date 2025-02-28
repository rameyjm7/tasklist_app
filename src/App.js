import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskList from "./TaskList";
import "./styles.css";

const getStoredTasks = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [
    { id: "1", title: "Finish project report", priority: "High", dueDate: "2025-03-01" },
    { id: "2", title: "Buy groceries", priority: "Medium", dueDate: "2025-03-02" },
    { id: "3", title: "Book dentist appointment", priority: "Low", dueDate: "2025-03-05" },
  ];
};

function App() {
  const [tasks, setTasks] = useState(getStoredTasks);
  const [contextMenu, setContextMenu] = useState(null);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle Right-Click for Context Menu
  const handleRightClick = (event, task) => {
    event.preventDefault(); // Prevent default right-click behavior
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      task,
    });
  };

  // Close the context menu
  const closeContextMenu = () => setContextMenu(null);

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    closeContextMenu();
  };

  // Edit a task
  const editTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isEditing: true } : task
    );
    setTasks(updatedTasks);
    closeContextMenu();
  };

  // Add a new task
  const addTask = () => {
    const newTask = {
      id: String(Date.now()), // Unique ID
      title: "New Task",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0], // Default to today
      isEditing: true,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="app" onClick={closeContextMenu}>
      <h1>Task Manager</h1>
      <button className="add-task-btn" onClick={addTask}>+ Add Task</button> {/* ✅ Add Task Button */}
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div className="task-container" ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task ${snapshot.isDragging ? "dragging" : ""}`}
                      style={{ ...provided.draggableProps.style }}
                      onContextMenu={(e) => handleRightClick(e, task)} // ✅ Right-click to edit/delete
                    >
                      <TaskList task={task} tasks={tasks} setTasks={setTasks} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Context Menu */}
      {contextMenu?.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => editTask(contextMenu.task.id)}>Edit Task</button>
          <button onClick={() => deleteTask(contextMenu.task.id)}>Delete Task</button>
          <button onClick={closeContextMenu}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
