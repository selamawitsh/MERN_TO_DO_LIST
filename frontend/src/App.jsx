import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboard } from "react-icons/io5";

// Gold/Brown color palette
const gold = "bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-800";
const brown = "bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700";
const goldText = "text-yellow-600";
const brownText = "text-yellow-900";

function App() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const response = await axios.post("/api/todos", {
        title: newTask,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const fetchtasks = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchtasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditedTaskTitle(task.title);
  };

  const handleUpdate = async (taskId) => {
    try {
      const response = await axios.patch(`/api/todos/${taskId}`, {
        title: editedTaskTitle,
      });
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task))
      );
      setEditingTask(null);
      setEditedTaskTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/todos/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      const response = await axios.patch(`/api/todos/${taskId}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${gold} flex items-center justify-center py-10`}
    >
      <div className="w-full max-w-xl rounded-3xl shadow-2xl p-8 bg-white bg-opacity-90">
        <h1
          className={`text-4xl font-extrabold mb-8 text-center ${brownText} tracking-wide drop-shadow-lg`}
        >
          Task Manager
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
            className="flex-1 px-4 py-2 rounded-lg border-2 border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-yellow-50 text-yellow-900 placeholder-yellow-700"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-semibold bg-yellow-700 text-yellow-50 hover:bg-yellow-800 transition-all shadow-md"
          >
            Add Task
          </button>
        </form>

        {tasks.length === 0 ? (
          <div className="text-center text-yellow-800 font-medium py-8 bg-yellow-100 rounded-lg shadow-inner">
            No tasks yet...
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-md transition-all ${
                  task.completed
                    ? "bg-yellow-100 border-l-8 border-yellow-700"
                    : "bg-yellow-50 border-l-8 border-yellow-400"
                }`}
              >
                {editingTask === task._id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editedTaskTitle}
                      onChange={(e) => setEditedTaskTitle(e.target.value)}
                      className="flex-1 px-3 py-1 rounded-lg border-2 border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white text-yellow-900"
                    />
                    <button
                      onClick={() => setEditingTask(null)}
                      className="ml-2 text-xl text-yellow-700 hover:text-yellow-900 transition"
                      title="Cancel"
                    >
                      <IoClose />
                    </button>
                    <button
                      onClick={() => handleUpdate(task._id)}
                      className="ml-2 text-xl text-green-600 hover:text-green-800 transition"
                      title="Save"
                    >
                      <MdOutlineDone />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleComplete(task._id)}
                        className={`text-2xl rounded-full p-1 transition ${
                          task.completed
                            ? "bg-yellow-700 text-yellow-50 hover:bg-yellow-800"
                            : "bg-yellow-200 text-yellow-700 hover:bg-yellow-300"
                        }`}
                        title={
                          task.completed
                            ? "Mark as Incomplete"
                            : "Mark as Complete"
                        }
                      >
                        {task.completed ? <MdOutlineDone /> : <IoClipboard />}
                      </button>
                      <span
                        className={`text-lg font-medium ${
                          task.completed
                            ? "line-through text-yellow-700 opacity-60"
                            : "text-yellow-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-xl text-yellow-700 hover:text-yellow-900 transition"
                        title="Edit"
                      >
                        <MdModeEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-xl text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
