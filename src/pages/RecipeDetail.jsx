import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Rating from '../components/Rating.jsx'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, getRecipeById, isFavorite, toggleFavorite, rateRecipe, getUserRating, removeRecipe } = useRecipes()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const found = getRecipeById(id)
    setRecipe(found)
  }, [id, recipes])

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-heading text-5xl text-brand-500 mb-3">Recipe Not Found</h1>
          <p className="text-gray-500 text-lg mb-6">The recipe you're looking for may have been removed.</p>
          <Link to="/recipes" className="btn btn-primary">Browse Recipes</Link>
        </div>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookingTime
  const fav = isFavorite(recipe.id)
  const userRating = getUserRating(recipe.id)
  const isOwner = user && recipe.authorId === user.id

  function handleFavorite() {
    if (!user) { navigate('/login'); return }
    toggleFavorite(recipe.id)
  }

  function handleRate(star) { rateRecipe(recipe.id, star) }
  function toggleIngredient(index) { setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] })) }

  const diffColors = { 'Easy': 'bg-emerald-500', 'Medium': 'bg-brand-500', 'Hard': 'bg-red-500' }

  return (
    <div>
      <div className="relative h-[50vh] min-h-[380px] max-h-[520px] overflow-hidden">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" onError={e => { e.target.src = '/images/dish-1.jpg' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 py-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white uppercase tracking-wide mb-3">{recipe.category}</span>
          <h1 className="font-heading text-[clamp(2rem,4vw,3rem)] text-white mb-3">{recipe.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Rating rating={recipe.rating} ratingsCount={recipe.ratingsCount} onRate={handleRate} userRating={userRating} isLoggedIn={!!user} />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${diffColors[recipe.difficulty] || ''}`}>{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="py-7 border-b border-cream-300">
          <div className="flex flex-wrap gap-6 mb-5">
            {[
              { icon: '12 6 12 12 16 14', val: `${recipe.prepTime} min`, label: 'Prep Time' },
              { val: `${recipe.cookingTime} min`, label: 'Cook Time' },
              { val: `${totalTime} min`, label: 'Total Time' },
              { val: recipe.authorName, label: 'Author' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 bg-cream-200 rounded-lg text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points={item.icon || '12 6 12 12 16 14'}/></svg>
                <div>
                  <span className="block text-sm font-bold text-charcoal-800">{item.val}</span>
                  <span className="block text-xs text-gray-400">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className={`btn items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${fav ? 'border-2 border-red-500 text-red-500 hover:bg-red-50 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:-translate-y-0.5' : 'btn-primary'}`}
              onClick={handleFavorite}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {fav ? 'Saved' : 'Save Recipe'}
            </button>
            {isOwner && (
              <>
                <Link to={`/recipes/${recipe.id}/edit`} className="btn items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-cream-300 text-charcoal-800 hover:border-brand-500 hover:text-brand-500 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(212,160,23,0.25)] transition-all duration-300">Edit Recipe</Link>
                <button className="btn items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-all duration-300" onClick={() => setShowDeleteModal(true)}>Delete</button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 py-12">
          <div>
            <h2 className="font-heading text-2xl mb-4">About this recipe</h2>
            <p className="text-[1.05rem] text-gray-500 leading-relaxed mb-8">{recipe.description}</p>

            <h2 className="font-heading text-2xl mb-5">Instructions</h2>
            <ol className="flex flex-col gap-5">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-[0.98rem] text-gray-500 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <aside>
            <div className="bg-white border border-cream-300/60 rounded-xl p-7 lg:sticky lg:top-[96px]">
              <h3 className="font-heading text-xl mb-5">Ingredients</h3>
              <ul className="flex flex-col gap-2.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className={`flex items-center gap-3 py-2 border-b border-cream-200 text-sm transition-all ${checkedIngredients[i] ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                    <button
                      onClick={() => toggleIngredient(i)}
                      className={`w-[22px] h-[22px] rounded border-2 flex items-center justify-center shrink-0 text-xs transition-all ${
                        checkedIngredients[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-cream-400 hover:border-emerald-500'
                      }`}
                    >{checkedIngredients[i] ? '✓' : ''}</button>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-[440px] w-full shadow-card-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl mb-3">Delete Recipe?</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Are you sure you want to permanently delete this recipe? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button className="btn btn-outline text-charcoal-800" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { removeRecipe(recipe.id); navigate('/profile') }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
