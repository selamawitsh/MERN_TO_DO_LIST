import React from 'react'
import { useState } from 'react'
import axios from 'axios';


function App() {
  const [newTask, setNewTask] = useState('')
  
  const [tasks, setTasks] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
   try {
    const response = await axios.post('/api/todos', {
      title: newTask
    });
    setTasks([...tasks, response.data]);
    setNewTask(''); 

    console.log("Task added:", response.data);
    
   } catch (error) {
    console.error("Error adding task:", error);
    
   }

  }


   return (
    <>
    <div>
      <div>
        <h1>Task Manager</h1>
        <form onSubmit={handleSubmit}>
          <input 
          type="text" 
          placeholder="Enter a task"
          value={newTask}
          onChange={(e)=> setNewTask(e.target.value)}
          required
           />

          <button 
          type="submit"
          
          >Add Task</button>
        </form>

      </div>
    </div>
    </>
  )
}

export default App

