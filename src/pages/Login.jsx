import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.trim() || !form.password) { setError('Please fill in all fields.'); return }
    const result = await login(form.email, form.password)
    if (result.success) navigate('/')
    else setError(result.error)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="w-full max-w-[440px] bg-white rounded-2xl px-10 py-12 shadow-card-hover border border-cream-300/60">
        <div className="text-center mb-8">
          <h1 className="font-heading text-[1.8rem] mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-[0.95rem]">Sign in to your Grill Master account</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-lg text-[0.9rem] mb-5">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-semibold text-sm mb-2 text-charcoal-800">Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email" className="w-full px-4 py-3.5 border-2 border-cream-300 rounded-lg outline-none focus:border-brand-500 transition-colors" />
          </div>
          <div className="mb-5">
            <label className="block font-semibold text-sm mb-2 text-charcoal-800">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" className="w-full px-4 py-3.5 pr-12 border-2 border-cream-300 rounded-lg outline-none focus:border-brand-500 transition-colors" />
              <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors p-1">
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full">Log In</button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-brand-500 font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
