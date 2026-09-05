import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  function closeMenu() { setMenuOpen(false) }

  function handleLogout() {
    logout()
    closeMenu()
    setUserMenuOpen(false)
    navigate('/')
  }

  function navLinkClass({ isActive }) {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-brand-400 bg-brand-500/20'
        : 'text-white/90 hover:text-white hover:bg-white/10'
    }`
  }

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-charcoal-900 backdrop-blur-2xl shadow-xl border-b border-brand-500/40'
          : 'bg-charcoal-900 backdrop-blur-2xl border-b border-brand-500/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 z-10 shrink-0" onClick={closeMenu}>
          <img src="/images/logo.png" alt="Grill Master Logo" className="h-10 w-auto rounded-lg" />
          <span className="font-heading text-lg font-bold text-white hidden sm:block leading-tight">Restaurant &amp;<br />Recipe Hub</span>
        </Link>

        <nav
          className={`hidden md:flex items-center gap-1`}
        >
          <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/recipes" className={navLinkClass} onClick={closeMenu}>Browse Recipes</NavLink>
          <NavLink to="/submit-recipe" className={navLinkClass} onClick={closeMenu}>Submit Recipe</NavLink>
          {user && <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>Profile</NavLink>}
        </nav>

        <div className="flex items-center gap-3 z-10">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn btn-glass-outline">Log In</Link>
              <Link to="/register" className="btn btn-glass-primary">Sign Up</Link>
            </div>
          ) : (
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white">{user.fullName.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/70 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-charcoal-900 border border-brand-500/30 rounded-xl shadow-card-xl overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3.5 border-b border-white/10">
                    <p className="font-semibold text-white text-sm truncate">{user.fullName}</p>
                    <p className="text-xs text-white/60 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-white/90 hover:bg-white/10 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10 transition-colors text-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-start justify-center pt-28 px-4 animate-fadeIn" onClick={() => setShowSearch(false)}>
          <form className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-card-xl w-full max-w-[640px]" onSubmit={handleSearch} onClick={e => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Search recipes by name or ingredient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-3 outline-none text-base bg-transparent"
            />
            <button type="submit" className="btn btn-primary px-6 py-3">Search</button>
            <button type="button" className="text-2xl text-gray-400 hover:text-gray-600 px-2" onClick={() => setShowSearch(false)}>&times;</button>
          </form>
        </div>
      )}
    </header>

    {menuOpen && (
      <>
        <div className="fixed inset-0 bg-black/60 z-[90] md:hidden" onClick={closeMenu}></div>
        <div
          ref={menuRef}
          className="fixed md:hidden top-0 right-0 h-full w-[300px] bg-charcoal-900 border-l border-brand-500/40 shadow-2xl flex flex-col items-start pt-[88px] px-7 gap-2 z-[100] overflow-y-auto transition-transform duration-300 ease-in-out"
        >
          <NavLink to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/recipes" className={navLinkClass} onClick={closeMenu}>Browse Recipes</NavLink>
          <NavLink to="/submit-recipe" className={navLinkClass} onClick={closeMenu}>Submit Recipe</NavLink>
          {user && <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>Profile</NavLink>}

          <div className="flex flex-col gap-3 w-full mt-6 pt-6 border-t border-white/10">
            {!user ? (
              <>
                <Link to="/login" className="btn-glass-outline w-full text-center" onClick={closeMenu}>Log In</Link>
                <Link to="/register" className="btn-glass-primary w-full text-center" onClick={closeMenu}>Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn-glass-outline w-full text-center">Logout</button>
            )}
          </div>
        </div>
      </>
    )}
    </>
  )
}
