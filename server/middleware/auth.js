import jwt from 'jsonwebtoken'

function getSecret() {
  return process.env.JWT_SECRET || 'grill-master-dev-secret'
}

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, fullName: user.fullName }, getSecret(), { expiresIn: '7d' })
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }
  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, getSecret())
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}
