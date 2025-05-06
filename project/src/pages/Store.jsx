import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Store = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/product')
      .then((response) => setProducts(response.data.products))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-300">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
          Store
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-700 p-6 rounded-lg bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Product Image */}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-56 object-cover mb-4 rounded-lg transition-transform duration-300 hover:scale-105"
              />

              {/* Product Name */}
              <h2 className="text-xl font-bold text-gray-100">{product.name}</h2>

              {/* Product Price */}
              <p className="text-2xl font-extrabold text-amber-400 my-2">${product.price}</p>

              {/* Product Description */}
              <p className="mt-2 text-gray-300 text-justify">{product.description}</p>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;