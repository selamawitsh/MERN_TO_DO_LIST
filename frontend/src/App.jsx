import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { MdOutlineDone } from "react-icons/md";
import {IoClose} from "react-icons/io5";
import { MdModeEdit } from 'react-icons/md';
import {FaTrash} from 'react-icons/fa6';
import { IoClipboard } from 'react-icons/io5';
import buildFullPath from './../node_modules/axios/lib/core/buildFullPath';



function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');


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

  const fetchtasks = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTasks(response.data);
      console.log("Tasks fetched:", response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  } 

  useEffect(() => {
    fetchtasks();
  }, []);

  const handleEdit = (task) => {  
    setEditingTask(task._id);
    setEditedTaskTitle(task.title);
  }

  const handleUpdate = async (taskId) => {
    try {
      const response =await axios.patch(`/api/todos/${taskId}`, {
        title: editedTaskTitle
      });
      setTasks(tasks.map(task =>
        task._id === taskId ? response.data : task
      ));
      setEditingTask(null);
      setEditedTaskTitle('');
      console.log("Task updated:", response.data);
      
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }


  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/todos/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      console.log("Task deleted:", taskId);
    } 
    catch (error) {
      console.error("Error deleting task:", error);
    }
  } 

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find(task => task._id === taskId);     
      const response = await axios.patch(`/api/todos/${taskId}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t =>
        t._id === taskId ? response.data : t
      ));
      console.log("Task completion toggled:", response.data);
    } catch (error) {
      console.error("Error toggling task completion:", error);
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

      {tasks.length ===0 ? (
        <div>no tasks yet... </div>
      )
       : (
        <div> 
          {tasks.map((task) => (
            <div key={task._id}>
              {editingTask=== task._id ?
              (
              <div>
                <input 
                type='text'
                value={editedTaskTitle}
                onChange={(e)=> setEditedTaskTitle(e.target.value)}
                />
                <button onClick={()=>setEditingTask(null)}><IoClose/></button>
                <button onClick={()=>{ handleUpdate(task._id) }}><MdOutlineDone /></button>
              </div>
              ) : 
              
              
              (
              <div>
                <button>
                  {task.completed ?
                  <MdOutlineDone onClick={()=> toggleComplete(task._id)} style={{color: 'green'}}/> :
                  <IoClipboard onClick={()=> toggleComplete(task._id)} style={{color: 'red'}}/>
                  }
                </button>
                {task.title}
                <button onClick={()=> handleEdit(task)}><MdModeEdit/></button>
                <button onClick={()=>{handleDelete(task._id)}}><FaTrash/></button>
              </div>
              )}
            </div>
        ))}
        </div>
      )}
      </div>
    </div>
    </>
  )
}

export default App

