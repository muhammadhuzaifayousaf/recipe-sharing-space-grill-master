import './config.js'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import recipeRoutes from './routes/recipes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'Grill Master Recipe Hub API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' })
})

export default app
