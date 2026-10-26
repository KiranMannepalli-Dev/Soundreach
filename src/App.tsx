import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Network from './pages/Network';
import Platform from './pages/Platform';
import Advertisers from './pages/Advertisers';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import JokePopups from './components/JokePopups';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminLeads from './pages/admin/AdminLeads';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminVenues from './pages/admin/AdminVenues';
import AdminSettings from './pages/admin/AdminSettings';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white font-inter w-full overflow-x-hidden selection:bg-red-500/30 min-h-screen flex flex-col transition-colors duration-300 antialiased">
      {/* Public Navbar only on non-admin pages */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/network" element={<Network />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/advertisers" element={<Advertisers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Admin Login Route (Public access to gate) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRouteGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="venues" element={<AdminVenues />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* 404 Not Found Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Public Footer & Joke Popups only on non-admin pages */}
      {!isAdminRoute && (
        <>
          <Footer />
          <JokePopups />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <Router>
          <ScrollHandler />
          <AppContent />
        </Router>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default App;
