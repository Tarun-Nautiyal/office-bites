import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">OfficeBite</h2>
            <p className="text-sm text-gray-400">Fast, reliable office food delivery for working professionals.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/restaurants" className="hover:text-brand-400 transition-colors">Restaurants</Link></li>
              <li><Link to="/#popular" className="hover:text-brand-400 transition-colors">Popular Dishes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Contact</h3>
            <p className="text-sm text-gray-400">support@officebite.com</p>
            <p className="text-sm text-gray-400 mt-1">Mon–Fri 8am–8pm</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} OfficeBite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
