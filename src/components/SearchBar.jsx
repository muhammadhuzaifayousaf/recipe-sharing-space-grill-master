import { useState } from 'react'

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search recipes by name or ingredient...' }) {
  const [query, setQuery] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form className="flex gap-3" onSubmit={handleSubmit}>
      <div className="flex-1 flex items-center gap-3 px-4 bg-white border-2 border-cream-300 rounded-lg focus-within:border-brand-500 transition-colors">
        <svg className="text-gray-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 py-3 outline-none text-base bg-transparent"
        />
        {query && (
          <button type="button" className="text-2xl text-gray-400 hover:text-gray-600 leading-none" onClick={() => { setQuery(''); onSearch('') }}>&times;</button>
        )}
      </div>
      <button type="submit" className="btn btn-primary shrink-0">Search</button>
    </form>
  )
}
