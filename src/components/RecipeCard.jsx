import { Link } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useRecipes()
  const { user } = useAuth()

  function handleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    toggleFavorite(recipe.id)
  }

  const fav = isFavorite(recipe.id)

  return (
    <Link to={`/recipes/${recipe.id}`} className="group block bg-white rounded-xl overflow-hidden border border-cream-300/60 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-250">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
          onError={e => { e.target.src = '/images/dish-1.jpg' }}
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-brand-500 text-white uppercase tracking-wide">
          {recipe.category}
        </span>
        {user && (
          <button
            onClick={handleFavorite}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
              fav ? 'bg-white text-red-500' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-charcoal-800 mb-2 group-hover:text-brand-600 transition-colors">{recipe.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3.5">{recipe.description.substring(0, 100)}...</p>
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-brand-500 text-sm tracking-wide">{'★'.repeat(Math.floor(recipe.rating))}{'☆'.repeat(5 - Math.floor(recipe.rating))}</span>
            <span className="text-sm font-semibold text-charcoal-800">{recipe.rating}</span>
          </div>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-cream-200 text-gray-500">{recipe.difficulty}</span>
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {recipe.cookingTime + recipe.prepTime} min
          </span>
        </div>
      </div>
    </Link>
  )
}
