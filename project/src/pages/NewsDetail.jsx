import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the ID from the URL

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`http://localhost:5000/api/news/${id}`);
        if (response.data && response.data.id) {
          setArticle(response.data);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError(err.message || "Failed to load news article.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-300 py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  if (!article) {
    return <div className="text-center text-gray-300 py-20">News article not found.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
            {article.title}
          </h1>
          <p className="text-sm text-gray-400">{article.created_at}</p>
        </header>
        {/* Article Content */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden p-6">
          {/* Image */}
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-64 object-cover object-center mb-6 rounded-lg"
          />
          {/* Full Content */}
          <div className="prose prose-sm prose-gray max-w-none">
            <p dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;