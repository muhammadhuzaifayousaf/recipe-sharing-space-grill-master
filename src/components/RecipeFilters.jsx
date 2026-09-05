const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Vegan', 'Vegetarian', 'Desserts', 'Snacks', 'Drinks']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const TIME_FILTERS = [
  { label: 'Any Time', value: 'any' },
  { label: 'Under 15 min', value: '15' },
  { label: 'Under 30 min', value: '30' },
  { label: 'Under 60 min', value: '60' },
  { label: 'Over 60 min', value: '60+' }
]
const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rated' },
  { label: 'Newest', value: 'newest' },
  { label: 'Cooking Time', value: 'time' }
]

export default function RecipeFilters({ filters, onFilterChange }) {
  function handleChange(key, value) {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-cream-300/60 mb-9">
      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const active = filters.category === cat || (!filters.category && cat === 'All')
            return (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  active
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'border-cream-300 text-gray-500 bg-white hover:border-brand-500 hover:text-brand-500'
                }`}
                onClick={() => handleChange('category', cat === 'All' ? '' : cat)}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Difficulty</label>
          <select
            className="px-3 py-2 border border-cream-300 rounded-lg bg-white text-sm text-charcoal-800 min-w-[150px] outline-none focus:border-brand-500 transition-colors"
            value={filters.difficulty || ''}
            onChange={e => handleChange('difficulty', e.target.value)}
          >
            {DIFFICULTIES.map(d => (
              <option key={d} value={d === 'All' ? '' : d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cooking Time</label>
          <select
            className="px-3 py-2 border border-cream-300 rounded-lg bg-white text-sm text-charcoal-800 min-w-[150px] outline-none focus:border-brand-500 transition-colors"
            value={filters.time || 'any'}
            onChange={e => handleChange('time', e.target.value)}
          >
            {TIME_FILTERS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sort By</label>
          <select
            className="px-3 py-2 border border-cream-300 rounded-lg bg-white text-sm text-charcoal-800 min-w-[150px] outline-none focus:border-brand-500 transition-colors"
            value={filters.sort || 'popular'}
            onChange={e => handleChange('sort', e.target.value)}
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
