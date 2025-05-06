import React from 'react';
import { useNavigate } from 'react-router-dom';
import adventure10 from '../assets/adventure10.jpeg';

const About = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Decorative Background SVG */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bgGradient)" />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="overflow-hidden rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <img
              src={adventure10}
              alt="Maasai artisans"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Our Heritage, Our Future
            </h2>
            <p 
              className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed"
              style={{ textAlign: 'justify' }}
            >
              Sustainable Maasai Legacy is more than just a marketplace—it's a bridge between 
              centuries-old traditions and contemporary appreciation for artisanal craftsmanship. 
              Every piece in our collection tells a story of cultural preservation and sustainable practices.
            </p>
            <p 
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
              style={{ textAlign: 'justify' }}
            >
              By supporting our artisans, you're not just acquiring a beautiful piece of art; 
              you're participating in the continuation of Maasai cultural heritage and supporting 
              sustainable livelihoods in local communities.
            </p>
            <button 
              onClick={() => navigate('/become-warrior')}
              className="inline-block px-10 py-4 text-xl font-bold text-black bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-lg hover:from-amber-600 hover:to-amber-500 transition-all duration-500 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
