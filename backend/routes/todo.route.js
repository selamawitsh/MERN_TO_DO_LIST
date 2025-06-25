import express from 'express';
// import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller.js';   
import Todo from '../models/todo.model.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const todo= new Todo({
        title: req.body.title
    })

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})


router.patch('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (req.body.title !== undefined) {
            todo.title = req.body.title;
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed;
        }
        console.log(req.body);
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   );  


router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });       
    }
});

export default router;