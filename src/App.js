import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import VendorDashboard from './pages/VendorDashboard';
import AdminPanel from './pages/AdminPanel';
import ModeratorPanel from './pages/ModeratorPanel';
import ErrorBoundary from './pages/ErrorBoundary';
import NetworkError from './pages/NetworkError';
import ErrorLogs from './pages/ErrorLogs';

// Components
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VendorRequestForm from './components/user/VendorRequestForm';
import LivreurDashboard from './components/livreur/LivreurDashboard';

// Delivery Scan Page (pour QR code livreur)
import DeliveryScanPage from './pages/delivery/DeliveryScanPage';

// Legal Pages
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

import './App.css';

// Layout component that conditionally renders Header/Navbar/Footer
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Hide Header/Navbar/Footer for dashboard routes and delivery scan
  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/vendor') ||
    location.pathname.startsWith('/moderator') ||
    location.pathname.startsWith('/livreur') ||
    location.pathname.startsWith('/delivery/scan');

  // Page d'accueil a besoin de plus d'espace
  const isHomePage = location.pathname === '/';

  // Déterminer le padding-top selon la page
  const getMainPadding = () => {
    if (isDashboardRoute) return '';
    if (isHomePage) return 'pt-0';
    return 'pt-28 sm:pt-32 lg:pt-40 xl:pt-44';
  };

  return (
    <div className="App min-h-screen flex flex-col">
      {!isDashboardRoute && <Header />}
      {!isDashboardRoute && <Navbar />}
      <main className={`flex-grow ${getMainPadding()}`}>
        {children}
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <Router>
                <AppLayout>
                  <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* Routes d'authentification (accessibles seulement si déconnecté) */}
                    <Route
                      path="/login"
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Login />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Register />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Routes légales (accessibles à tous) */}
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />

                    {/* Routes protégées (nécessitent une authentification) */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/become-vendor"
                      element={
                        <ProtectedRoute>
                          <VendorRequestForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/vendor/*"
                      element={
                        <ProtectedRoute>
                          <VendorDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/moderator/*"
                      element={
                        <ProtectedRoute>
                          <ModeratorPanel />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/errors"
                      element={
                        <ProtectedRoute>
                          <ErrorLogs />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route Livreur */}
                    <Route
                      path="/livreur/*"
                      element={
                        <ProtectedRoute>
                          <LivreurDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Route d'erreur réseau */}
                    <Route path="/network-error" element={<NetworkError />} />

                    {/* Route publique pour scan QR code livreur */}
                    <Route path="/delivery/scan/:deliveryCode" element={<DeliveryScanPage />} />
                  </Routes>
                </AppLayout>
              </Router>

              {/* Toast notifications container */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 99999 }}
              />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;