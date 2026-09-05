import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import BrowseRecipes from './pages/BrowseRecipes.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import SubmitRecipe from './pages/SubmitRecipe.jsx'
import EditRecipe from './pages/EditRecipe.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-[72px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<BrowseRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/submit-recipe" element={<ProtectedRoute><SubmitRecipe /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[60vh] text-center">
              <div className="max-w-7xl mx-auto px-6">
                <h1 className="font-heading text-5xl text-brand-500 mb-3">404</h1>
                <p className="text-gray-500 text-lg mb-6">Page not found</p>
                <a href="/" className="btn btn-primary inline-block">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
