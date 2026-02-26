// Theme & Scrolling
import { ThemeProvider } from './context/ThemeContext';
import { ReactLenis } from 'lenis/react';

// Modules
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Components
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';

// Pages - Storefront
import Home from './pages/storefront/Home';
import Products from './pages/storefront/Products';
import ProductDetails from './pages/storefront/ProductDetails';
import CartPage from './pages/storefront/CartPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import LoginPage from './pages/storefront/LoginPage';
import RegisterPage from './pages/storefront/RegisterPage';
import ProfilePage from './pages/storefront/ProfilePage';
import MyOrders from './pages/storefront/MyOrders';
import WishlistPage from './pages/storefront/WishlistPage';

// Pages - Admin
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageBanners from './pages/admin/ManageBanners';
import ManageSettings from './pages/admin/ManageSettings';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';

// Layouts
import StorefrontLayout from './components/storefront/StorefrontLayout';
import AdminLayout from './components/admin/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

// Extracted routes into a separate component to use useLocation hook for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Storefront Routes */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="collections" element={<PageTransition><Products /></PageTransition>} />
          <Route path="collections/:categoryId" element={<PageTransition><Products /></PageTransition>} />
          <Route path="products/:productId" element={<PageTransition><ProductDetails /></PageTransition>} />
          <Route path="cart" element={<PageTransition><CartPage /></PageTransition>} />
          <Route path="checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="register" element={<PageTransition><RegisterPage /></PageTransition>} />
          <Route path="wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />

          {/* User Dashboard Routes */}
          <Route path="profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
          <Route path="profile/orders" element={<ProtectedRoute><PageTransition><MyOrders /></PageTransition></ProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="products" element={<PageTransition><ManageProducts /></PageTransition>} />
          <Route path="categories" element={<PageTransition><ManageCategories /></PageTransition>} />
          <Route path="banners" element={<PageTransition><ManageBanners /></PageTransition>} />
          <Route path="orders" element={<PageTransition><ManageOrders /></PageTransition>} />
          <Route path="users" element={<PageTransition><ManageUsers /></PageTransition>} />
          <Route path="settings" element={<PageTransition><ManageSettings /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CustomCursor />
          <AuthProvider>
            <StoreProvider>
              <AdminProvider>
                <AnimatedRoutes />
              </AdminProvider>
            </StoreProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ReactLenis>
  );
}

export default App;
