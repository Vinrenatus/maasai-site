import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/product')
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Decorative Background SVG */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="featuredProductsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#featuredProductsGradient)" />
        </svg>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent uppercase tracking-wider">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                >
                  Add to Cart
                </button>
              </div>
              <div className="px-2 pb-4">
                <h3 className="text-lg font-semibold mb-2 text-center text-gray-100 group-hover:text-white transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-amber-400 text-center hover:text-amber-500 transition-colors duration-300">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
