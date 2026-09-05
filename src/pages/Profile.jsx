import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useRecipes } from '../context/RecipeContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Profile() {
  const { user } = useAuth()
  const { getUserRecipes, getFavoritesList, getUserRatingsCount, removeRecipe } = useRecipes()
  const [activeTab, setActiveTab] = useState('recipes')
  const [deleteModal, setDeleteModal] = useState(null)

  const myRecipes = getUserRecipes()
  const favorites = getFavoritesList()
  const ratingsCount = getUserRatingsCount()

  return (
    <div>
      <div className="bg-cream-200 py-12 border-b border-cream-300 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-heading text-[2.4rem] text-charcoal-800">My Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-[72px]">
        <div className="bg-white rounded-xl border border-cream-300/60 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-3xl font-bold shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="font-heading text-2xl mb-1">{user.fullName}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-gray-400 text-[0.82rem] mt-1">Member since {user.createdAt}</p>
            </div>
            <div className="flex gap-8 sm:ml-auto">
              {[
                { val: myRecipes.length, label: 'Recipes' },
                { val: favorites.length, label: 'Favorites' },
                { val: ratingsCount, label: 'Ratings' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <span className="block text-2xl font-bold text-charcoal-800">{s.val}</span>
                  <span className="block text-[0.82rem] text-gray-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-1 border-b-2 border-cream-300 mb-8">
          {[
            { key: 'recipes', label: `My Recipes (${myRecipes.length})` },
            { key: 'favorites', label: `My Favorites (${favorites.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-3 text-[0.95rem] font-semibold border-b-2 -mb-0.5 transition-all duration-200 ${
                activeTab === tab.key
                  ? 'text-brand-500 border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-brand-500'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'recipes' && (
          myRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {myRecipes.map(recipe => (
                <div key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                  <div className="flex gap-2 px-5 pb-4 pt-1">
                    <Link to={`/recipes/${recipe.id}`} className="px-4 py-1.5 rounded-lg text-xs font-semibold border-2 border-cream-300 text-charcoal-800 hover:border-brand-500 hover:text-brand-500 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(212,160,23,0.25)] transition-all duration-300">View</Link>
                    <Link to={`/recipes/${recipe.id}/edit`} className="px-4 py-1.5 rounded-lg text-xs font-semibold border-2 border-cream-300 text-charcoal-800 hover:border-brand-500 hover:text-brand-500 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(212,160,23,0.25)] transition-all duration-300">Edit</Link>
                    <button className="px-4 py-1.5 rounded-lg text-xs font-semibold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_4px_14px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 transition-all duration-300" onClick={() => setDeleteModal(recipe)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>}
              extra={<><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></>}
              title="No recipes yet"
              desc="You haven't submitted any recipes yet. Share your culinary creation with the community!"
              linkTo="/submit-recipe"
              linkText="Submit a Recipe"
            />
          )
        )}

        {activeTab === 'favorites' && (
          favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {favorites.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>}
              title="No favorites yet"
              desc="You haven't saved any recipes yet. Explore our recipes and save your favorites."
              linkTo="/recipes"
              linkText="Browse Recipes"
            />
          )
        )}
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center p-6" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-xl p-8 max-w-[440px] w-full shadow-card-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl mb-3">Delete Recipe?</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Are you sure you want to permanently delete &quot;{deleteModal.title}&quot;? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button className="px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-cream-300 text-charcoal-800 hover:border-brand-500 hover:text-brand-500 hover:-translate-y-0.5 transition-all duration-300" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={() => { removeRecipe(deleteModal.id); setDeleteModal(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, extra, title, desc, linkTo, linkText }) {
  return (
    <div className="text-center py-16 px-6 text-gray-400">
      <svg className="mx-auto mb-5 opacity-40" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {icon}{extra}
      </svg>
      <h3 className="text-xl font-heading text-gray-600 mb-2">{title}</h3>
      <p className="text-sm mb-6 max-w-[400px] mx-auto">{desc}</p>
      <Link to={linkTo} className="btn btn-primary btn-lg">{linkText}</Link>
    </div>
  )
}
