# Recipe Sharing Space: Grill Master

![Grill Master](https://github.com/user-attachments/assets/83ba5746-9a00-4173-85ae-224e0a6aa1c1)

Welcome to **Recipe Sharing Space: Grill Master** — a community-driven recipe sharing web application. Browse a curated library of recipes, search by name or ingredients, filter by category/difficulty/cooking time, view detailed recipes with step-by-step instructions and ratings, submit your own recipes with device image upload, and manage a personal profile with favorites.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS v3 |
| **Backend** | Node.js, Express 5, REST API |
| **Auth** | JWT (7-day tokens) + bcrypt password hashing |
| **Storage** | JSON file-based persistence (server) + browser localStorage (favorites/ratings) |
| **Fonts** | Playfair Display (headings) + Inter (body) via Google Fonts |

## Features

### Homepage
- Full-width hero banner with call-to-action buttons
- Floating search bar (navigates to filtered recipe list)
- "Explore by Category" grid with 8 categories: Breakfast, Lunch, Dinner, Vegan, Vegetarian, Desserts, Snacks, Drinks — each showing live recipe counts
- Featured recipes section with "View All" link

### Recipe Browsing & Search
- Full-text search across title, description, ingredients, and category
- Filter pills for category, dropdowns for difficulty (Easy/Medium/Hard), cooking time (Any/15/30/60/60+ min), and sort order (Popular/Rated/Newest/Time)
- Filter state synced to URL search params for shareable links
- Empty state when no results match

### Recipe Detail
- Full-width hero image with category badge, title, star rating, and difficulty badge
- Stats row: prep time, cook time, total time, author name
- Interactive star rating (login required)
- Save/unsave favorite toggle (login required; redirects guests to login)
- Sticky ingredients sidebar with interactive checkboxes
- Step-by-step numbered instructions
- Owner-only Edit and Delete actions with confirmation modal

### Submit & Edit Recipes
- Full form: title, description, dynamic ingredient list (add/remove), dynamic instruction list (add/remove), category, difficulty, prep time, cooking time
- Image upload via device with live preview and remove option (stored as base64 data URL)
- Client-side validation with inline error messages
- Edit form pre-populated for recipe owners; non-owners redirected

### User Authentication
- Register with full name, email, password (min 6 chars), and confirm password
- Login with email and password (show/hide toggle)
- JWT tokens stored in localStorage; auto-attached to all API requests
- Session restore on page reload

### User Profile
- Avatar (initial-based), name, email, member-since date
- Stats: recipe count, favorites count, ratings count
- Tabbed view: "My Recipes" and "My Favorites"
- Edit/Delete actions on own recipe cards with confirmation modals

### Header & Navigation
- Fixed/sticky navbar with brand logo, nav links, and search modal
- Mobile slide-out drawer menu (hamburger)
- Auth-aware: shows Login/Sign Up for guests, avatar + dropdown (Profile/Logout) for logged-in users

### Footer
- Logo, tagline, and site description
- Social media links (Instagram, Facebook, YouTube, Pinterest)
- Link columns: Explore, Community, Support

## Getting Started

### Prerequisites
- Node.js 18+

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional)
```bash
cp .env.example .env
```
Set `JWT_SECRET` to a long random string and `PORT` if needed (default `5000`).

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Express server port |
| `JWT_SECRET` | dev secret | Secret key for signing JWT tokens |
| `VITE_API_URL` | `http://localhost:5000` | Frontend API base URL |
| `GRILLMASTER_DATA_DIR` | `server/data/.data` | Server data storage directory |

### 3. Run the backend (Express API on port 5000)
```bash
npm run server        # production
# or
npm run server:dev     # with auto-reload (nodemon)
```

### 4. Run the frontend (Vite dev server, separate terminal)
```bash
npm run dev
```
Open http://localhost:5173

> **Note:** The frontend requires the backend running for recipes and authentication to work. The recipe store is automatically seeded with 12 sample recipes on first server access.

### Build for production
```bash
npm run build
```

## API Reference

Base URL: `http://localhost:5000`

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, get JWT token | No |

### Recipe Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/recipes` | List recipes (with filters) | No |
| GET | `/api/recipes/:id` | Get a single recipe | No |
| POST | `/api/recipes` | Create a recipe | JWT |
| PUT | `/api/recipes/:id` | Update a recipe (owner only) | JWT |
| DELETE | `/api/recipes/:id` | Delete a recipe (owner only) | JWT |

### Query Parameters (GET /api/recipes)

| Param | Values | Description |
|-------|--------|-------------|
| `category` | `Breakfast`, `Lunch`, `Dinner`, `Vegan`, `Vegetarian`, `Desserts`, `Snacks`, `Drinks` | Filter by category |
| `difficulty` | `Easy`, `Medium`, `Hard` | Filter by difficulty |
| `time` | `any`, `15`, `30`, `60`, `60+` | Filter by max total cooking time (minutes) |
| `search` | any string | Search title, description, ingredients, category |
| `sort` | `popular` (default), `rated`, `newest`, `time` | Sort order |

## Project Structure

```
.
├── public/                      # Static assets (images, logo)
├── src/
│   ├── components/              # Header, Footer, RecipeCard, RecipeFilters, SearchBar, Rating, CategoryCard, ProtectedRoute, ScrollToTop
│   ├── context/                 # AuthContext (JWT auth state) & RecipeContext (API data)
│   ├── pages/                   # Home, BrowseRecipes, RecipeDetail, SubmitRecipe, EditRecipe, Login, Register, Profile
│   ├── data/                    # initialRecipes.js (12 seed recipes)
│   ├── services/                # api.js (fetch client with JWT) & localStorage.js (favorites/ratings persistence)
│   └── styles/                  # global.css (Tailwind base + custom component classes)
├── server/
│   ├── config.js                # Environment variable loader
│   ├── index.js                 # Express app setup (CORS, routes, error handler)
│   ├── routes/
│   │   ├── auth.js              # Register & login endpoints
│   │   └── recipes.js           # Recipe CRUD + filter logic + auto-seeding
│   ├── middleware/
│   │   └── auth.js              # JWT token signing & Bearer authentication middleware
│   └── data/
│       ├── store.js             # JSON file read/write abstraction
│       └── .data/               # Runtime data (recipes.json, users.json)
├── .env.example                 # Environment variable template
├── index.html                   # Vite entry HTML
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Custom theme (brand/cream/charcoal colors, custom fonts)
├── postcss.config.js            # Tailwind + Autoprefixer
├── server.js                    # Backend entry point
└── package.json
```

## License

This project is open-source and available under the [MIT License](LICENSE).