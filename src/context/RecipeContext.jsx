import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api.js'
import { getFavorites, toggleFavorite as toggleFavoriteInStorage, saveRating, getRatings, getUserRatings } from '../services/localStorage.js'
import { useAuth } from './AuthContext.jsx'

const RecipeContext = createContext(null)

export function RecipeProvider({ children }) {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])

  function loadRecipes() {
    api.getRecipes()
      .then(res => setRecipes(res.recipes))
      .catch(err => {
        console.error('Failed to load recipes:', err)
        setRecipes([])
      })
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  useEffect(() => {
    if (user) {
      setFavoriteIds(getFavorites(user.id))
    } else {
      setFavoriteIds([])
    }
  }, [user])

  async function addRecipe(recipe) {
    const res = await api.createRecipe(recipe)
    await loadRecipes()
    return res.recipe
  }

  async function updateRecipe(id, updatedRecipe) {
    const res = await api.updateRecipe(id, updatedRecipe)
    await loadRecipes()
    return res.recipe
  }

  async function removeRecipe(id) {
    await api.deleteRecipe(id)
    await loadRecipes()
  }

  function getRecipeById(id) {
    return recipes.find(r => r.id === id)
  }

  function getFavoritesList() {
    if (!user) return []
    return recipes.filter(r => favoriteIds.includes(r.id))
  }

  function isFavorite(recipeId) {
    if (!user) return false
    return favoriteIds.includes(recipeId)
  }

  function toggleFavorite(recipeId) {
    if (!user) return false
    const updated = toggleFavoriteInStorage(user.id, recipeId)
    setFavoriteIds([...updated])
    return updated.includes(recipeId)
  }

  async function rateRecipe(recipeId, rating) {
    if (!user) return false
    saveRating(recipeId, user.id, rating)
    const allRatings = getRatings(recipeId)
    const ratingValues = Object.values(allRatings)
    const avg = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    if (getRecipeById(recipeId)) {
      try {
        await api.updateRecipe(recipeId, { rating: Math.round(avg * 10) / 10, ratingsCount: ratingValues.length })
      } catch (e) { /* rating update best-effort for seed recipes */ }
    }
    await loadRecipes()
    return true
  }

  function getUserRating(recipeId) {
    if (!user) return 0
    const ratings = getRatings(recipeId)
    return ratings[user.id] || 0
  }

  function getUserRecipes() {
    if (!user) return []
    return recipes.filter(r => r.authorId === user.id)
  }

  function getUserRatingsCount() {
    if (!user) return 0
    const ratings = getUserRatings(user.id)
    return Object.keys(ratings).length
  }

  function refreshRecipes() {
    loadRecipes()
  }

  return (
    <RecipeContext.Provider value={{
      recipes,
      addRecipe,
      updateRecipe,
      removeRecipe,
      getRecipeById,
      getFavoritesList,
      isFavorite,
      toggleFavorite,
      rateRecipe,
      getUserRating,
      getUserRecipes,
      getUserRatingsCount,
      refreshRecipes
    }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  const context = useContext(RecipeContext)
  if (!context) throw new Error('useRecipes must be used within RecipeProvider')
  return context
}
