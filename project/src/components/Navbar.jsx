import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const navLinks = (
    <>
      <button
        type="button"
        onClick={() => {
          navigate('/');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        Home
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/story');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        Story
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/news');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        News
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/store');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        Store
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/contact');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        Contact
      </button>
      <button
        type="button"
        onClick={() => {
          navigate('/become-warrior');
          setIsMenuOpen(false);
        }}
        className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
      >
        Become Warrior
      </button>
      {/* Add Admin Button for all logged-in users */}
      {user && (
        <button
          type="button"
          onClick={() => {
            navigate('/admin');
            setIsMenuOpen(false);
          }}
          className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
        >
          Admin
        </button>
      )}
    </>
  );

  const authLinks = (
    <>
      {!user ? (
        <>
          <button
            type="button"
            onClick={() => {
              navigate('/login');
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/signup');
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
          >
            Signup
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 bg-transparent border border-transparent hover:border-amber-400 hover:bg-gray-700 rounded transition-all duration-300 font-bold"
        >
          Logout
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-20 transition-transform duration-300 hover:scale-110 drop-shadow-lg"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">{navLinks}</div>
          <div className="hidden md:flex items-center space-x-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border border-gray-700 rounded overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search products & news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 py-1 text-black outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500 px-3 py-1 hover:bg-amber-600 transition-colors duration-300"
                aria-label="Search"
              >
                Search
              </button>
            </form>
            {cartItems.length > 0 && (
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="relative hover:text-amber-400 transition-colors duration-300"
              >
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1 text-xs">
                  {cartItems.length}
                </span>
              </Link>
            )}
            <div className="flex items-center space-x-4">{authLinks}</div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-gray-800 to-gray-900 px-4 pt-2 pb-3 space-y-4">
          <div className="flex flex-col space-y-2">{navLinks}</div>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-gray-700 rounded overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products & news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-black outline-none"
            />
            <button
              type="submit"
              className="bg-amber-500 px-3 py-1 hover:bg-amber-600 transition-colors duration-300"
              aria-label="Search"
            >
              Search
            </button>
          </form>
          {cartItems.length > 0 && (
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="relative inline-block hover:text-amber-400 transition-colors duration-300"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1 text-xs">
                {cartItems.length}
              </span>
            </Link>
          )}
          <div className="flex flex-col space-y-2">{authLinks}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;