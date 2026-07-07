import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineGlobe } from 'react-icons/hi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineGlobe className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold font-heading">Travel<span className="gradient-text">Ease</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none dark:text-white" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none dark:text-white" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 font-medium">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600">Sign up</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">Admin: admin@travelease.com / admin123</p>
            <p className="text-xs text-gray-500">User: user@travelease.com / user123</p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900" alt="Travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 to-accent-500/60 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold font-heading mb-4">Start Your Journey</h2>
            <p className="text-white/80 text-lg">Discover amazing places at home and abroad</p>
          </div>
        </div>
      </div>
    </div>
  );
}
