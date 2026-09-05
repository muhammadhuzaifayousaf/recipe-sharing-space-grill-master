import { createContext, useContext, useState, useEffect } from 'react'
import { api, getToken, setToken } from '../services/api.js'
import { getCurrentUser, saveCurrentUser, logoutUser } from '../services/localStorage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const cached = getCurrentUser()
    if (token && cached) {
      setUser(cached)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setToken(null)
      logoutUser()
      setUser(null)
    }
    window.addEventListener('grillmaster:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('grillmaster:unauthorized', handleUnauthorized)
  }, [])

  async function register(fullName, email, password) {
    try {
      const res = await api.register(fullName, email, password)
      setToken(res.token)
      saveCurrentUser(res.user)
      setUser(res.user)
      return { success: true }
    } catch (err) {
      if (err.status === 409) return { success: false, error: err.data?.error || 'An account with this email already exists.' }
      return { success: false, error: err.message || 'Registration failed. Is the server running?' }
    }
  }

  async function login(email, password) {
    try {
      const res = await api.login(email, password)
      setToken(res.token)
      saveCurrentUser(res.user)
      setUser(res.user)
      return { success: true }
    } catch (err) {
      if (err.status === 401) return { success: false, error: err.data?.error || 'Invalid email or password.' }
      return { success: false, error: err.message || 'Login failed. Is the server running?' }
    }
  }

  function logout() {
    setToken(null)
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
