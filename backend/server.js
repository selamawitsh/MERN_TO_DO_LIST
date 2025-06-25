import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import todoRoutes from './routes/todo.route.js'

dotenv.config()


const app = express()
app.use(express.json());
connectDB()
app.use('/api/todos',todoRoutes)


app.listen(4000, () => {
  console.log('Server is running on port http://localhost:4000')
})