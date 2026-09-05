# Grill Master - Restaurant & Recipe Hub

[![Grill Master](https://github.com/user-attachments/assets/9fc08bfe-1c00-4259-9ed4-49f1873d20c4)](https://muhammadhuzaifayousaf.github.io/Grill-Master_Restaurant-and-Recipe-Hub_EcodeCamp-Internship/)

Welcome to **Grill Master - Restaurant & Recipe Hub**, a full-stack recipe sharing web application. Users can browse recipes, search by name or ingredients, filter by category/difficulty/time, view detailed recipes with step-by-step instructions and ratings, submit their own recipes (with device image upload), and manage a personal profile with favorites.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router v6, Tailwind CSS (v3)
- **Backend**: Node.js + Express (REST API)
- **Auth**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Storage**: JSON files on the server (recipes, users) + browser localStorage (favorites/ratings)

## Features

- **Homepage**: Logo + navbar, live search, full-width hero banner with CTA buttons, featured categories (Breakfast, Vegan, Desserts, etc.), and featured recipes.
- **Recipe List**: Grid of recipes showing name, image, description, rating, category, and difficulty, with search and category/difficulty/time/sort filters.
- **Recipe Detail**: Title, image, ingredients, step-by-step instructions, ratings, favorite toggle, and delete (for owners).
- **Submit Recipe**: Form for title, description, ingredients, instructions, category, difficulty, prep/cook time, and image upload from the device.
- **Profile**: User's submitted recipes, favorites, and ratings; edit/delete own recipes.
- **User Authentication**: Register and login with JWT tokens.

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

The frontend is configured to call the API at `http://localhost:5000` by default. To change it, set `VITE_API_URL` in a `.env` file (e.g. `VITE_API_URL=http://localhost:5000`).

> Note: The frontend needs the backend running for recipes and authentication to work.

### Build for production
```bash
npm run build
```

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint                | Description                     | Auth  |
|--------|-------------------------|---------------------------------|-------|
| GET    | `/api/recipes`          | List recipes (with filters)     | No    |
| GET    | `/api/recipes/:id`      | Get a single recipe             | No    |
| POST   | `/api/recipes`          | Create a recipe                 | JWT   |
| PUT    | `/api/recipes/:id`      | Update a recipe (owner only)    | JWT   |
| DELETE | `/api/recipes/:id`      | Delete a recipe (owner only)    | JWT   |
| POST   | `/api/auth/register`    | Register a new user             | No    |
| POST   | `/api/auth/login`       | Log in, get JWT token           | No    |

Recipe list supports query params: `category`, `difficulty`, `time` (`any`, `30`, `45`, `60`, `60+`), `search`, and `sort` (`popular`, `rated`, `newest`, `time`).

## Project Structure

```bash
.
├── public/                  # Static assets (images, logo)
├── src/
│   ├── components/          # Header, Footer, RecipeCard, RecipeFilters, SearchBar, etc.
│   ├── context/             # AuthContext (JWT) & RecipeContext (API data)
│   ├── pages/               # Home, BrowseRecipes, RecipeDetail, SubmitRecipe, Login, Register, Profile
│   ├── data/                # initialRecipes.js (seed data)
│   ├── services/            # api.js (fetch client) & localStorage.js
│   └── styles/              # global.css (Tailwind)
├── server/
│   ├── routes/              # auth.js & recipes.js (Express routers)
│   ├── middleware/          # auth.js (JWT verify)
│   └── data/                # JSON file persistence
├── .env.example
└── package.json
```

## License

This project is open-source and available under the [MIT License](LICENSE).
