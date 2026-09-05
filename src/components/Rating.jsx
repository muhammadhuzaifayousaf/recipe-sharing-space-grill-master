import { useState } from 'react'

export default function Rating({ recipeId, rating, ratingsCount, onRate, userRating, isLoggedIn }) {
  const [hovered, setHovered] = useState(0)

  function handleClick(star) {
    if (!isLoggedIn) return
    onRate(star)
  }

  const displayRating = hovered || userRating || rating

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" role="group" aria-label="Rate this recipe">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => isLoggedIn && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            disabled={!isLoggedIn}
            className={`text-xl leading-none transition-colors duration-150 ${
              star <= displayRating ? 'text-brand-500' : 'text-gray-300'
            } ${isLoggedIn ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="font-bold text-charcoal-800">{rating}</span>
      {ratingsCount !== undefined && (
        <span className="text-sm text-gray-400">({ratingsCount} rating{ratingsCount !== 1 ? 's' : ''})</span>
      )}
    </div>
  )
}
