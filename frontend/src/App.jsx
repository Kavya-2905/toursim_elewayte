import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Chatbot from './components/common/Chatbot';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import AITripPlanner from './pages/AITripPlanner';
import BudgetPlanner from './pages/BudgetPlanner';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import TravelBlogs from './pages/TravelBlogs';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManageHotels from './pages/admin/ManageHotels';
import ManagePackages from './pages/admin/ManagePackages';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageReviews from './pages/admin/ManageReviews';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/ai-trip-planner" element={<AITripPlanner />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/blogs" element={<TravelBlogs />} />

          {/* Protected Routes */}
          <Route path="/booking-confirmation/:id" element={
            <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
          } />
          <Route path="/booking-history" element={
            <ProtectedRoute><BookingHistory /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/destinations" element={
            <ProtectedRoute adminOnly><ManageDestinations /></ProtectedRoute>
          } />
          <Route path="/admin/hotels" element={
            <ProtectedRoute adminOnly><ManageHotels /></ProtectedRoute>
          } />
          <Route path="/admin/packages" element={
            <ProtectedRoute adminOnly><ManagePackages /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly><ManageBookings /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute adminOnly><ManageReviews /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', background: '#333', color: '#fff' }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
