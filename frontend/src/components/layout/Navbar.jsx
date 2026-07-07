import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiHeart, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { HiOutlineGlobe } from 'react-icons/hi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Packages', path: '/packages' },
    { name: 'Budget', path: '/budget-planner' },
    { name: 'Blogs', path: '/blogs' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiOutlineGlobe className="text-white text-xl" />
            </div>
            <span className={`text-xl font-bold font-heading ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
              Travel<span className="gradient-text">Ease</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/20 ${
                  scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/20'
              }`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className={`hidden sm:flex p-2 rounded-full transition-all hover:scale-110 ${
                    scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FiHeart size={20} />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all ${
                      scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className={`hidden sm:block text-sm font-medium ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown className={`hidden sm:block ${scrolled ? 'text-gray-500' : 'text-white/70'}`} size={14} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <FiMapPin size={16} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <FiUser size={16} /> Profile
                      </Link>
                      <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <FiHeart size={16} /> Wishlist
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/20'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
