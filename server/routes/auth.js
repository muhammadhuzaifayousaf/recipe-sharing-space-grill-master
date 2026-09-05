import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { createHash } from 'crypto'
import { store } from '../data/store.js'
import { signToken } from '../middleware/auth.js'

const router = Router()

function idForEmail(email) {
  return 'user-' + createHash('sha1').update(email.toLowerCase()).digest('hex').slice(0, 16)
}

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' })
    }
    const users = store.getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = {
      id: idForEmail(email),
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date().toISOString().split('T')[0]
    }
    users.push(user)
    store.saveUsers(users)
    const token = signToken(user)
    res.status(201).json({ success: true, token, user: { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } })
  } catch (err) { next(err) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }
    const users = store.getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    }
    const token = signToken(user)
    res.json({ success: true, token, user: { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } })
  } catch (err) { next(err) }
})

export default router
