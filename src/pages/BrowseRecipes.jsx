import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import RecipeFilters from '../components/RecipeFilters.jsx'

export default function BrowseRecipes() {
  const { recipes } = useRecipes()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    time: searchParams.get('time') || 'any',
    sort: searchParams.get('sort') || 'popular'
  })

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (filters.category) params.category = filters.category
    if (filters.difficulty) params.difficulty = filters.difficulty
    if (filters.time !== 'any') params.time = filters.time
    if (filters.sort !== 'popular') params.sort = filters.sort
    setSearchParams(params, { replace: true })
  }, [search, filters])

  const filtered = useMemo(() => {
    let result = [...recipes]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q)) || r.category.toLowerCase().includes(q)
      )
    }
    if (filters.category) result = result.filter(r => r.category === filters.category)
    if (filters.difficulty) result = result.filter(r => r.difficulty === filters.difficulty)
    if (filters.time !== 'any') {
      const totalTime = (r) => r.cookingTime + r.prepTime
      if (filters.time === '60+') {
        result = result.filter(r => totalTime(r) > 60)
      } else {
        result = result.filter(r => totalTime(r) <= parseInt(filters.time))
      }
    }
    switch (filters.sort) {
      case 'rated': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'time': result.sort((a, b) => (a.cookingTime + a.prepTime) - (b.cookingTime + b.prepTime)); break
      default: result.sort((a, b) => b.ratingsCount - a.ratingsCount)
    }
    return result
  }, [recipes, search, filters])

  return (
    <div>
      <div className="bg-cream-200 py-12 border-b border-cream-300 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-heading text-[2.4rem] text-charcoal-800 mb-2">Browse Recipes</h1>
          <p className="text-base text-gray-500">Discover your next favorite dish from our collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-[72px]">
        <div className="mb-7">
          <SearchBar initialValue={search} onSearch={q => setSearch(q)} />
        </div>
        <RecipeFilters filters={filters} onFilterChange={setFilters} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 text-gray-400">
            <svg className="mx-auto mb-5 opacity-40" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <h3 className="text-xl font-heading text-gray-600 mb-2">No recipes found</h3>
            <p className="text-sm">Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
