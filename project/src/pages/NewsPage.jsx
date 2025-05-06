import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaArrowRight } from 'react-icons/fa'; // Import an arrow icon for "Read More"

// Utility function to create a snippet from the content
const getSnippet = (content, maxLength = 100) => {
  if (!content) return '';
  const text = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const NewsPage = () => {
  const [news, setNews] = useState([]);

  // Fetch news data on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/news')
      .then((response) => setNews(response.data.news))
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
            Latest News
          </h1>
          <p className="text-lg text-gray-400">
            Stay updated with the latest stories and updates from around the world.
          </p>
        </header>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={item.image_url || 'https://via.placeholder.com/600'} // Fallback image if URL is missing
                alt={item.title}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
              />

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  {item.title}
                </h2>
                <p className="text-base text-gray-300 leading-relaxed text-justify">
                  {getSnippet(item.content)} {/* Show only a snippet of the content */}
                </p>

                <footer className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.created_at}</span>
                  <Link
                    to={`/news/${item.id}`} // Redirect to the NewsDetail page
                    className="flex items-center text-sm font-medium text-amber-400 hover:text-amber-500 transition-colors"
                  >
                    Read More{' '}
                    <FaArrowRight className="ml-1 text-sm" /> {/* Add an arrow icon */}
                  </Link>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;