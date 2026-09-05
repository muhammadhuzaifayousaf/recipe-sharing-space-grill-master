import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Vegan', 'Vegetarian', 'Desserts', 'Snacks', 'Drinks']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecipeById, updateRecipe, recipes } = useRecipes()
  const { user } = useAuth()
  const [form, setForm] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [instructions, setInstructions] = useState([])
  const [errors, setErrors] = useState({})
  const [notFound, setNotFound] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const recipe = getRecipeById(id)
    if (!recipe) { setNotFound(true); return }
    if (recipe.authorId !== user.id) { navigate('/recipes'); return }
    setForm({ title: recipe.title, description: recipe.description, category: recipe.category, difficulty: recipe.difficulty, prepTime: recipe.prepTime, cookingTime: recipe.cookingTime, image: recipe.image })
    setIngredients([...recipe.ingredients])
    setInstructions([...recipe.instructions])
  }, [id, recipes])

  if (notFound) return (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <div><h1 className="font-heading text-5xl text-brand-500 mb-3">Recipe Not Found</h1><p className="text-gray-500 text-lg">The recipe you're looking for may have been removed.</p></div>
    </div>
  )

  if (!form) return null

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  function handleImageSelect(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, image: reader.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  function addIngredient() { setIngredients([...ingredients, '']) }
  function removeIngredient(i) { if (ingredients.length > 1) setIngredients(ingredients.filter((_, idx) => idx !== i)) }
  function updateIngredient(i, v) { const u = [...ingredients]; u[i] = v; setIngredients(u) }
  function addStep() { setInstructions([...instructions, '']) }
  function removeStep(i) { if (instructions.length > 1) setInstructions(instructions.filter((_, idx) => idx !== i)) }
  function updateStep(i, v) { const u = [...instructions]; u[i] = v; setInstructions(u) }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Recipe title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.prepTime || parseInt(form.prepTime) < 0) errs.prepTime = 'Valid prep time is required'
    if (!form.cookingTime || parseInt(form.cookingTime) < 0) errs.cookingTime = 'Valid cooking time is required'
    if (ingredients.filter(i => i.trim()).length === 0) errs.ingredients = 'At least one ingredient is required'
    if (instructions.filter(s => s.trim()).length === 0) errs.instructions = 'At least one instruction step is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    try {
      await updateRecipe(id, { title: form.title.trim(), description: form.description.trim(), image: form.image.trim() || '/images/dish-1.jpg', category: form.category, difficulty: form.difficulty, prepTime: parseInt(form.prepTime), cookingTime: parseInt(form.cookingTime), ingredients: ingredients.filter(i => i.trim()), instructions: instructions.filter(s => s.trim()) })
      navigate(`/recipes/${id}`)
    } catch (err) {
      setErrors({ title: err.message || 'Failed to update recipe. Is the server running?' })
    }
  }

  return (
    <div>
      <div className="bg-cream-200 py-12 border-b border-cream-300 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-heading text-[2.4rem] text-charcoal-800 mb-2">Edit Recipe</h1>
          <p className="text-base text-gray-500">Update your recipe details</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-[72px]">
        <form className="max-w-[720px] mx-auto bg-white p-10 rounded-xl border border-cream-300/60 shadow-card" onSubmit={handleSubmit}>
          <FormField label="Recipe Title" error={errors.title}>
            <input type="text" id="title" name="title" value={form.title} onChange={handleChange} placeholder="Enter recipe name" className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${errors.title ? 'border-red-500' : 'border-cream-300 focus:border-brand-500'}`} />
          </FormField>

          <FormField label="Short Description" error={errors.description}>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Describe your recipe..." rows="4" className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors resize-y ${errors.description ? 'border-red-500' : 'border-cream-300 focus:border-brand-500'}`} />
          </FormField>

          <FormField label="Ingredients" error={errors.ingredients}>
            <div className="flex flex-col gap-2.5">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <input type="text" value={ing} onChange={e => updateIngredient(i, e.target.value)} placeholder={`Ingredient ${i + 1}`} className="flex-1 px-4 py-2.5 border-2 border-cream-300 rounded-lg outline-none focus:border-brand-500 transition-colors text-[0.9rem]" />
                  {ingredients.length > 1 && <button type="button" onClick={() => removeIngredient(i)} className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-gray-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.35)] hover:scale-110 transition-all duration-300 mt-1 shrink-0">&times;</button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addIngredient} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-brand-500 border-2 border-dashed border-brand-500 hover:bg-brand-500/10 hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(212,160,23,0.25)] transition-all duration-300 mt-3">+ Add Ingredient</button>
          </FormField>

          <FormField label="Instructions" error={errors.instructions}>
            <div className="flex flex-col gap-2.5">
              {instructions.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-7 h-[38px] flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0 mt-0.5">{i + 1}.</span>
                  <textarea value={step} onChange={e => updateStep(i, e.target.value)} placeholder={`Step ${i + 1}`} rows="2" className="flex-1 px-4 py-2.5 border-2 border-cream-300 rounded-lg outline-none focus:border-brand-500 transition-colors text-[0.9rem] resize-y" />
                  {instructions.length > 1 && <button type="button" onClick={() => removeStep(i)} className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-gray-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.35)] hover:scale-110 transition-all duration-300 mt-1 shrink-0">&times;</button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addStep} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-brand-500 border-2 border-dashed border-brand-500 hover:bg-brand-500/10 hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(212,160,23,0.25)] transition-all duration-300 mt-3">+ Add Step</button>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <FormField label="Category">
              <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 border-2 border-cream-300 rounded-lg bg-white outline-none focus:border-brand-500 transition-colors">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Difficulty">
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full px-4 py-3 border-2 border-cream-300 rounded-lg bg-white outline-none focus:border-brand-500 transition-colors">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <FormField label="Prep Time (minutes)" error={errors.prepTime}>
              <input type="number" id="prepTime" name="prepTime" value={form.prepTime} onChange={handleChange} min="0" className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${errors.prepTime ? 'border-red-500' : 'border-cream-300 focus:border-brand-500'}`} />
            </FormField>
            <FormField label="Cooking Time (minutes)" error={errors.cookingTime}>
              <input type="number" id="cookingTime" name="cookingTime" value={form.cookingTime} onChange={handleChange} min="0" className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${errors.cookingTime ? 'border-red-500' : 'border-cream-300 focus:border-brand-500'}`} />
            </FormField>
          </div>

          <FormField label="Recipe Image" hint="Upload a photo from your device. If left empty, the current image is kept.">
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="edit-recipe-image"
              />
              {!form.image.startsWith('data:') && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-lg border-2 border-dashed border-brand-500 text-brand-500 font-semibold hover:bg-brand-500/10 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Browse &amp; Upload Image
                </button>
              )}
              {form.image && (
                <div className="relative w-full rounded-lg overflow-hidden border border-cream-300">
                  <img src={form.image} alt="Recipe preview" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </FormField>

          <button type="submit" className="btn btn-primary btn-lg w-full">Update Recipe</button>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, error, hint, children }) {
  return (
    <div className="mb-6">
      <label className="block font-semibold text-sm mb-2 text-charcoal-800">{label}</label>
      {children}
      {error && <span className="block text-red-500 text-[0.82rem] mt-1.5">{error}</span>}
      {hint && !error && <span className="block text-gray-400 text-[0.82rem] mt-1.5">{hint}</span>}
    </div>
  )
}
