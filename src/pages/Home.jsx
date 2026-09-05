import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'

const categories = [
  { name: 'Breakfast', image: '/images/breakfast.jpg', description: 'Start your day right' },
  { name: 'Lunch', image: '/images/lunch.jpg', description: 'Midday favorites' },
  { name: 'Dinner', image: '/images/dinner.jpg', description: 'Hearty evening meals' },
  { name: 'Vegan', image: '/images/vegan.jpg', description: 'Plant-based goodness' },
  { name: 'Vegetarian', image: '/images/vegetarian.jpg', description: 'Meat-free delights' },
  { name: 'Desserts', image: '/images/desserts.jpg', description: 'Sweet indulgences' },
  { name: 'Snacks', image: '/images/snacks.jpg', description: 'Quick bites' },
  { name: 'Drinks', image: '/images/drinks.jpg', description: 'Refreshing beverages' }
]

export default function Home() {
  const { recipes } = useRecipes()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const featuredRecipes = recipes.slice(0, 6)

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="Delicious food spread" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <h1 className="font-heading text-[clamp(2.5rem,6vw,4.2rem)] font-bold text-white leading-tight mb-5">Discover Delicious Recipes</h1>
          <p className="text-lg text-white/80 max-w-[620px] leading-relaxed mb-9">
            Explore delicious recipes, discover new flavors, and share your favorite dishes with a community of food lovers.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/recipes" className="btn btn-primary btn-lg">Browse Recipes</Link>
            <Link to="/submit-recipe" className="btn btn-outline btn-lg">Submit a Recipe</Link>
          </div>
        </div>
      </section>

      <section className="relative -mt-9 z-10 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <form className="flex gap-3 max-w-[680px] mx-auto bg-white p-2 rounded-2xl shadow-lg" onSubmit={handleSearch}>
            <div className="flex-1 flex items-center gap-3 px-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search recipes by name or ingredient..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 py-3 outline-none text-base bg-transparent"
              />
            </div>
            <button type="submit" className="btn btn-primary px-8 py-3.5">Search</button>
          </form>
        </div>
      </section>

      <section className="py-[72px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[2.2rem] text-charcoal-800 mb-2">Explore by Category</h2>
            <p className="text-base text-gray-500">Find recipes that match your mood</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map(cat => {
              const count = recipes.filter(r => r.category === cat.name).length
              return (
                <CategoryCard key={cat.name} name={cat.name} image={cat.image} description={cat.description} recipeCount={count} />
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-cream-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[2.2rem] text-charcoal-800 mb-2">Featured Recipes</h2>
            <p className="text-base text-gray-500">Handpicked favorites from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/recipes" className="btn btn-primary btn-lg">View All Recipes</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
