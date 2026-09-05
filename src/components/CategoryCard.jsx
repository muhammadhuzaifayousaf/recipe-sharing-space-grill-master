import { Link } from 'react-router-dom'

export default function CategoryCard({ name, image, description, recipeCount }) {
  return (
    <Link to={`/recipes?category=${name}`} className="group block rounded-xl overflow-hidden relative aspect-[4/3] hover:-translate-y-1 transition-transform duration-250">
      <div className="w-full h-full relative">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent group-hover:from-black/85 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg font-semibold text-white mb-0.5">{name}</h3>
          <p className="text-xs text-white/60">{recipeCount} recipes</p>
          {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
        </div>
      </div>
    </Link>
  )
}
