import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <FaHome />
            <span>Go Home</span>
          </Link>
          <Link
            to="/destinations"
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center space-x-2"
          >
            <FaSearch />
            <span>Explore</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
