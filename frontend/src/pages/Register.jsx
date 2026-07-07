import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineGlobe } from 'react-icons/hi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    if (form.password.length < 6) return alert('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      navigate('/dashboard');
    } catch (err) { /* handled in context */ } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineGlobe className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold font-heading">Travel<span className="gradient-text">Ease</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create an account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Join TravelEase and start exploring</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Full Name" />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Email Address" />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Phone (optional)" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Password (min 6 chars)" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <FiEyeOff /> : <FiEye />}</button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Confirm Password" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 relative">
        <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900" alt="Travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 to-accent-500/60 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold font-heading mb-4">Join TravelEase</h2>
            <p className="text-white/80 text-lg">Your adventure awaits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
