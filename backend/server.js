import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'


const app = express()

app.get('/', (req, res) =>{
    res.send('hello server')
})

app.listen(4000, () => {
  console.log('Server is running on port http://localhost:4000')
})