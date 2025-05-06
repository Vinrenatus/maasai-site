import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import OrderHistory from './pages/OrderHistory';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Lazy-loaded components
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Story = lazy(() => import('./pages/Story'));
const Contact = lazy(() => import('./pages/Contact'));
const BecomeWarrior = lazy(() => import('./pages/BecomeWarrior'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetail = lazy(() => import('./pages/NewsDetail')); // Add this line
const Store = lazy(() => import('./pages/Store'));
const Cart = lazy(() => import('./pages/Cart'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SearchResults = lazy(() => import('./pages/SearchResults'));

// Import the CheckoutModal component from the correct path
import CheckoutModal from './pages/CheckoutModal'; // Updated path

// Home component (combines multiple components)
const Home = () => (
  <>
    <Hero />
    <FeaturedProducts />
    <About />
  </>
);

function App() {
  const [showModal, setShowModal] = useState(false);

  // Functions to control the CheckoutModal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <Router>
      <AuthProvider>
        <CartProvider> {/* Ensure CartProvider wraps the app */}
          <div className="min-h-screen flex flex-col bg-stone-50">
            {/* Navbar */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-grow">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  {/* Home route */}
                  <Route path="/" element={<Home />} />

                  {/* Other routes */}
                  <Route path="/story" element={<Story />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/become-warrior" element={<BecomeWarrior />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/news/:id" element={<NewsDetail />} /> {/* Add this route */}
                  <Route path="/store" element={<Store />} />
                  <Route path="/cart" element={<Cart onCheckout={openModal} />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/search" element={<SearchResults />} />

                  {/* Catch-all route for invalid paths */}
                  <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
              </Suspense>

              {/* Checkout Modal */}
              {showModal && <CheckoutModal onClose={closeModal} />}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;