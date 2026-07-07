import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/auth/profile');
      setUser(data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      toast.success('Registration successful!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/api/auth/profile', updates);
      setUser(res.data.data);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
