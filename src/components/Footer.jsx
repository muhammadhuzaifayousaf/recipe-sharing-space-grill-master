import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-gray-400 pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-2">
              <img src="/images/logo.png" alt="Grill Master Logo" className="h-9 rounded-md" />
              <span className="font-heading text-xl font-bold text-white leading-tight">Restaurant &amp;<br />Recipe Hub</span>
            </Link>
            <p className="font-heading italic text-brand-400 mb-4">Discover. Cook. Share.</p>
            <p className="text-sm leading-relaxed max-w-[340px] mb-6">
              A community-driven recipe platform where food lovers can discover delicious recipes, share their creations, and find inspiration for their next meal.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', rect: true },
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z', poly: '9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02' },
                { label: 'Pinterest', path: 'M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.19-5.05 1.19-5.05s-.3-.61-.3-1.5c0-1.41.82-2.46 1.83-2.46.86 0 1.28.65 1.28 1.42 0 .87-.55 2.17-.84 3.37-.24 1 .51 1.81 1.5 1.81 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.89 0-4.58 2.17-4.58 4.4 0 .87.33 1.8.75 2.31.08.1.09.19.07.29l-.28 1.13c-.04.19-.16.23-.36.14-1.32-.61-2.14-2.55-2.14-4.1 0-3.34 2.43-6.41 7-6.41 3.68 0 6.53 2.62 6.53 6.12 0 3.65-2.3 6.58-5.5 6.58-1.07 0-2.08-.56-2.43-1.22l-.66 2.52c-.24.93-.89 2.1-1.33 2.81.95.29 1.96.45 3.01.45 5.52 0 10-4.48 10-10S17.52 2 12 2z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-500 hover:border-brand-500 hover:text-brand-400 hover:bg-brand-500/10 hover:shadow-[0_0_16px_rgba(212,160,23,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.rect && <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>}
                    <path d={s.path}/>
                    {s.poly && <polygon points={s.poly}/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Explore', links: [{ text: 'Home', to: '/' }, { text: 'Browse Recipes', to: '/recipes' }, { text: 'Categories', to: '/recipes?category=Breakfast' }, { text: 'Submit Recipe', to: '/submit-recipe' }] },
            { title: 'Community', links: [{ text: 'User Profile', to: '/profile' }, { text: 'Favorites', to: '/recipes' }, { text: 'Popular Recipes', to: '/recipes' }, { text: 'Latest Recipes', to: '/recipes' }] },
            { title: 'Support', links: [{ text: 'Help Center', href: '#' }, { text: 'FAQs', href: '#' }, { text: 'Contact Us', href: '#' }, { text: 'Privacy Policy', href: '#' }, { text: 'Terms & Conditions', href: '#' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white text-base font-semibold font-body mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.text}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-gray-500 hover:text-brand-400 transition-colors">{link.text}</Link>
                    ) : (
                      <a href={link.href} className="text-sm text-gray-500 hover:text-brand-400 transition-colors">{link.text}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 py-5 text-center text-sm text-gray-600">
          &copy; 2026 Grill Master. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
