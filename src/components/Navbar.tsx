
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Home, User, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-green-800">
                {language === 'en' ? 'CattleBase' : 'ক্যাটেল বেস'}
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/market"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/market') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {t('nav.market')}
            </Link>
            <Link
              to="/farmers"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/farmers') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {t('nav.farmers')}
            </Link>
            <Link
              to="/vet"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vet') 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              {t('nav.vet')}
            </Link>
          </div>

          {/* Right side - Language switcher and auth */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  language === 'bn' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-green-700">
                    Welcome, {user && user.name}!
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="hidden sm:flex items-center space-x-1 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span>{t('nav.login')}</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <User className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t('nav.register')}</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
