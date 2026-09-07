import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Apply from './pages/Apply';
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import NotFound from './pages/NotFound';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import SavedHomes from './pages/SavedHomes';
import UserProfile from './pages/UserProfile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PropertiesAdmin from './pages/admin/PropertiesAdmin';
import PropertyForm from './pages/admin/PropertyForm';
import InquiriesAdmin from './pages/admin/InquiriesAdmin';
import ApplicationsAdmin from './pages/admin/ApplicationsAdmin';
import SiteSettingsAdmin from './pages/admin/SiteSettings';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserProtectedRoute from './components/common/UserProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/apartments" element={<Listings />} />
              <Route path="/apartments/:id" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply/:id" element={<Apply />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />

              {/* User auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User protected */}
              <Route path="/dashboard" element={<UserProtectedRoute><UserDashboard /></UserProtectedRoute>} />
              <Route path="/saved" element={<UserProtectedRoute><SavedHomes /></UserProtectedRoute>} />
              <Route path="/profile" element={<UserProtectedRoute><UserProfile /></UserProtectedRoute>} />

              {/* Admin — only accessible via direct URL */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="properties" element={<PropertiesAdmin />} />
                <Route path="properties/new" element={<PropertyForm />} />
                <Route path="properties/:id/edit" element={<PropertyForm />} />
                <Route path="inquiries" element={<InquiriesAdmin />} />
                <Route path="applications" element={<ApplicationsAdmin />} />
                <Route path="settings" element={<SiteSettingsAdmin />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
