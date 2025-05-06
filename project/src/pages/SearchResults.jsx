import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('query') || '';
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (searchTerm) {
      // Fetch products
      axios.get('http://localhost:5000/api/product')
        .then(res => {
          const filteredProducts = res.data.products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(filteredProducts);
        })
        .catch(err => console.error(err));

      // Fetch news
      axios.get('http://localhost:5000/api/news')
        .then(res => {
          const filteredNews = res.data.news.filter(n =>
            n.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setNews(filteredNews);
        })
        .catch(err => console.error(err));
    }
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
          Search Results for "{searchTerm}"
        </h1>
      </header>

      {/* Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Products
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 object-cover mb-4 rounded-lg transition-transform duration-300 hover:scale-105"
                />
                <h3 className="text-xl font-bold text-gray-100">{product.name}</h3>
                <p className="text-2xl font-extrabold text-amber-400">${product.price}</p>
                <p className="mt-2 text-gray-300">{product.description}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-md hover:bg-amber-600 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No matching products found.</p>
        )}
      </section>

      {/* News Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          News
        </h2>
        {news.length > 0 ? (
          <div className="space-y-8">
            {news.map(article => (
              <div
                key={article.id}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg transition-transform duration-300 hover:scale-105"
                />
                <h3 className="text-xl font-bold text-gray-100">{article.title}</h3>
                <p className="mt-2 text-gray-300">{article.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No matching news articles found.</p>
        )}
      </section>
    </div>
  );
};

export default SearchResults;