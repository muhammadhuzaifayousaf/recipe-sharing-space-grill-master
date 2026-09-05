const STORAGE_KEYS = {
  RECIPES: 'grillmaster_recipes',
  USERS: 'grillmaster_users',
  CURRENT_USER: 'grillmaster_current_user',
  FAVORITES: 'grillmaster_favorites',
  RATINGS: 'grillmaster_ratings'
}

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('LocalStorage error:', error)
  }
}

export function getRecipes() {
  return getFromStorage(STORAGE_KEYS.RECIPES) || []
}

export function saveRecipes(recipes) {
  setToStorage(STORAGE_KEYS.RECIPES, recipes)
}

export function addRecipe(recipe) {
  const recipes = getRecipes()
  recipes.push(recipe)
  saveRecipes(recipes)
  return recipe
}

export function updateRecipe(id, updatedRecipe) {
  const recipes = getRecipes()
  const index = recipes.findIndex(r => r.id === id)
  if (index !== -1) {
    recipes[index] = { ...recipes[index], ...updatedRecipe }
    saveRecipes(recipes)
    return recipes[index]
  }
  return null
}

export function deleteRecipe(id) {
  const recipes = getRecipes()
  const filtered = recipes.filter(r => r.id !== id)
  saveRecipes(filtered)
}

export function getUsers() {
  return getFromStorage(STORAGE_KEYS.USERS) || []
}

export function saveUsers(users) {
  setToStorage(STORAGE_KEYS.USERS, users)
}

export function getCurrentUser() {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER)
}

export function saveCurrentUser(user) {
  setToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

export function getFavorites(userId) {
  const allFavorites = getFromStorage(STORAGE_KEYS.FAVORITES) || {}
  return allFavorites[userId] || []
}

export function saveFavorites(userId, favorites) {
  const allFavorites = getFromStorage(STORAGE_KEYS.FAVORITES) || {}
  allFavorites[userId] = favorites
  setToStorage(STORAGE_KEYS.FAVORITES, allFavorites)
}

export function toggleFavorite(userId, recipeId) {
  const favorites = getFavorites(userId)
  const index = favorites.indexOf(recipeId)
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(recipeId)
  }
  saveFavorites(userId, favorites)
  return favorites
}

export function getRatings(recipeId) {
  const allRatings = getFromStorage(STORAGE_KEYS.RATINGS) || {}
  return allRatings[recipeId] || {}
}

export function saveRating(recipeId, userId, rating) {
  const allRatings = getFromStorage(STORAGE_KEYS.RATINGS) || {}
  if (!allRatings[recipeId]) allRatings[recipeId] = {}
  allRatings[recipeId][userId] = rating
  setToStorage(STORAGE_KEYS.RATINGS, allRatings)
}

export function getAllRatings() {
  return getFromStorage(STORAGE_KEYS.RATINGS) || {}
}

export function getUserRatings(userId) {
  const allRatings = getFromStorage(STORAGE_KEYS.RATINGS) || {}
  const userRatings = {}
  for (const recipeId in allRatings) {
    if (allRatings[recipeId][userId] !== undefined) {
      userRatings[recipeId] = allRatings[recipeId][userId]
    }
  }
  return userRatings
}

export function hashPassword(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'h_' + Math.abs(hash).toString(36)
}
