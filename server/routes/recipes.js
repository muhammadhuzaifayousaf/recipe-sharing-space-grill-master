import { Router } from 'express'
import { randomUUID } from 'crypto'
import { store } from '../data/store.js'
import { authenticate } from '../middleware/auth.js'
import initialRecipes from '../../src/data/initialRecipes.js'

const router = Router()

function seedIfEmpty() {
  const recipes = store.getRecipes()
  if (recipes.length === 0) {
    store.saveRecipes(initialRecipes)
  }
}

router.get('/', (req, res) => {
  seedIfEmpty()
  const { category, difficulty, time, search, sort } = req.query
  let result = store.getRecipes()

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q)) || r.category.toLowerCase().includes(q)
    )
  }
  if (category) result = result.filter(r => r.category === category)
  if (difficulty) result = result.filter(r => r.difficulty === difficulty)
  if (time && time !== 'any') {
    const total = (r) => r.cookingTime + r.prepTime
    if (time === '60+') result = result.filter(r => total(r) > 60)
    else result = result.filter(r => total(r) <= parseInt(time))
  }
  if (sort === 'rated') result = [...result].sort((a, b) => b.rating - a.rating)
  else if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  else if (sort === 'time') result = [...result].sort((a, b) => (a.cookingTime + a.prepTime) - (b.cookingTime + b.prepTime))
  else result = [...result].sort((a, b) => b.ratingsCount - a.ratingsCount)

  res.json({ success: true, recipes: result })
})

router.get('/:id', (req, res) => {
  seedIfEmpty()
  const recipe = store.getRecipes().find(r => r.id === req.params.id)
  if (!recipe) return res.status(404).json({ success: false, error: 'Recipe not found' })
  res.json({ success: true, recipe })
})

router.post('/', authenticate, (req, res, next) => {
  try {
    seedIfEmpty()
    const recipes = store.getRecipes()
    const { title, description, image, category, difficulty, prepTime, cookingTime, ingredients, instructions } = req.body
    if (!title || !description || !ingredients || !instructions || !cookingTime) {
      return res.status(400).json({ success: false, error: 'Missing required recipe fields' })
    }
    const recipe = {
      id: 'recipe-' + randomUUID(),
      title, description,
      image: image || '/images/dish-1.jpg',
      category, difficulty: difficulty || 'Easy',
      prepTime: parseInt(prepTime) || 0,
      cookingTime: parseInt(cookingTime) || 0,
      ingredients, instructions,
      rating: 0, ratingsCount: 0,
      authorId: req.user.id,
      authorName: req.user.fullName,
      createdAt: new Date().toISOString().split('T')[0]
    }
    recipes.push(recipe)
    store.saveRecipes(recipes)
    res.status(201).json({ success: true, recipe })
  } catch (err) { next(err) }
})

router.put('/:id', authenticate, (req, res, next) => {
  try {
    const recipes = store.getRecipes()
    const index = recipes.findIndex(r => r.id === req.params.id)
    if (index === -1) return res.status(404).json({ success: false, error: 'Recipe not found' })
    if (recipes[index].authorId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this recipe' })
    }
    recipes[index] = { ...recipes[index], ...req.body }
    store.saveRecipes(recipes)
    res.json({ success: true, recipe: recipes[index] })
  } catch (err) { next(err) }
})

router.delete('/:id', authenticate, (req, res, next) => {
  try {
    const recipes = store.getRecipes()
    const recipe = recipes.find(r => r.id === req.params.id)
    if (!recipe) return res.status(404).json({ success: false, error: 'Recipe not found' })
    if (recipe.authorId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this recipe' })
    }
    store.saveRecipes(recipes.filter(r => r.id !== req.params.id))
    res.json({ success: true })
  } catch (err) { next(err) }
})

export default router
