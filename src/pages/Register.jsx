import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }) }

  function validate() {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    const result = await register(form.fullName, form.email, form.password)
    if (result.success) navigate('/')
    else setErrors({ email: result.error })
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="w-full max-w-[440px] bg-white rounded-2xl px-10 py-12 shadow-card-hover border border-cream-300/60">
        <div className="text-center mb-8">
          <h1 className="font-heading text-[1.8rem] mb-2">Create Account</h1>
          <p className="text-gray-500 text-[0.95rem]">Join the Grill Master community</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', autoComplete: 'email' },
            { id: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', autoComplete: 'new-password' },
            { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password', autoComplete: 'new-password' },
          ].map(field => {
            const isPassword = field.type === 'password'
            const visible = field.id === 'confirmPassword' ? showConfirmPassword : showPassword
            const toggle = field.id === 'confirmPassword' ? () => setShowConfirmPassword(s => !s) : () => setShowPassword(s => !s)
            return (
              <div key={field.id} className="mb-5">
                <label className="block font-semibold text-sm mb-2 text-charcoal-800">{field.label}</label>
                <div className="relative">
                  <input
                    type={isPassword && visible ? 'text' : field.type} id={field.id} name={field.id}
                    value={form[field.id]} onChange={handleChange}
                    placeholder={field.placeholder} autoComplete={field.autoComplete}
                    className={`w-full px-4 py-3.5 ${isPassword ? 'pr-12' : ''} border-2 rounded-lg outline-none transition-colors ${errors[field.id] ? 'border-red-500' : 'border-cream-300 focus:border-brand-500'}`}
                  />
                  {isPassword && (
                    <button type="button" onClick={toggle} aria-label={visible ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors p-1">
                      {visible ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      )}
                    </button>
                  )}
                </div>
                {errors[field.id] && <span className="block text-red-500 text-[0.82rem] mt-1.5">{errors[field.id]}</span>}
              </div>
            )
          })}
          <button type="submit" className="btn btn-primary btn-lg w-full">Sign Up</button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-500 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
