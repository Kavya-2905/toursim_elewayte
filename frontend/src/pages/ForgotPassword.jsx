import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineGlobe } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <HiOutlineGlobe className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold font-heading">Travel<span className="gradient-text">Ease</span></span>
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiMail className="text-green-500" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">We've sent a password reset link to {email}</p>
              <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600 text-sm">Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Enter your email" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link to="/login" className="flex items-center gap-2 justify-center mt-6 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <FiArrowLeft size={14} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
