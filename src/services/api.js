const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TOKEN_KEY = 'grillmaster_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (res.status === 401 && token) {
    window.dispatchEvent(new CustomEvent('grillmaster:unauthorized'))
  }

  if (res.status === 404 && !res.json) {
    throw { status: 404, message: 'Recipe not found' }
  }

  let data
  try { data = await res.json() } catch { data = {} }

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),

  register: (fullName, email, password) => api.post('/api/auth/register', { fullName, email, password }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  getRecipes: (params) => api.get(`/api/recipes${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  getRecipe: (id) => api.get(`/api/recipes/${id}`),
  createRecipe: (recipe) => api.post('/api/recipes', recipe),
  updateRecipe: (id, recipe) => api.put(`/api/recipes/${id}`, recipe),
  deleteRecipe: (id) => api.delete(`/api/recipes/${id}`),
}
