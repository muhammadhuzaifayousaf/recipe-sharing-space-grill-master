import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.GRILLMASTER_DATA_DIR || path.join(__dirname, '.data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readFile(name, fallback) {
  ensureDir()
  const file = path.join(DATA_DIR, name)
  if (!fs.existsSync(file)) return fallback
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return fallback
  }
}

function writeFile(name, data) {
  ensureDir()
  const file = path.join(DATA_DIR, name)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

export const store = {
  getUsers: () => readFile('users.json', []),
  saveUsers: (users) => writeFile('users.json', users),
  getRecipes: () => readFile('recipes.json', []),
  saveRecipes: (recipes) => writeFile('recipes.json', recipes),
  getFavorites: () => readFile('favorites.json', {}),
  saveFavorites: (favorites) => writeFile('favorites.json', favorites),
}
