import React, { useState } from 'react';
import axios from 'axios';
import ceo from '../assets/ceo.jpeg';
import ceo2 from '../assets/ceo2.jpeg';
import ceo3 from '../assets/ceo3.jpeg'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/contact', formData);
      setResponseMessage(res.data.message);
      setErrorMessage('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error posting contact message:', error);
      setErrorMessage('An error occurred while sending your message.');
      setResponseMessage('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const teamMembers = [
    {
      name: 'Justin',
      image: ceo2,
      description: 'Founder & Visionary',
      message: 'Dedicated to preserving Maasai heritage.'
    },
    {
      name: 'Jane',
      image: ceo,
      description: 'Community Manager',
      message: 'Connecting cultures and communities.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen px-6 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
          🔗 Contact Us & Join the Maasai Legacy!
        </h1>
        <p className="text-lg text-gray-300">
          We would love to hear from you. Whether you have questions, feedback, or need assistance, our team is here to help.
        </p>
      </header>

      {/* Team Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img
                src={member.image}
                alt={`Photo of ${member.name}`}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover transition-transform duration-300 hover:scale-110"
              />
              <h3 className="text-xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {member.name}
              </h3>
              <p className="text-center text-gray-300">{member.description}</p>
              <p className="mt-2 text-center italic text-gray-400">
                "{member.message}"
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-300 mb-4">
            Reach Out to Us
          </h2>
          <p className="text-gray-400 mb-6">
            Have questions about joining the legacy or becoming an honorary Maasai warrior? Fill out the form, and our team will get back to you promptly.
          </p>

          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-bold text-gray-300">Contact Information</h3>
            <p>
              📩 Email:{" "}
              <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                sustainablemaasailegacy@gmail.com
              </span>
            </p>
            <p>
              📞 Phone:{" "}
              <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                +254 715 357 020
              </span>
            </p>
            <p>
              📍 Location:{" "}
              <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                Kenya, in the heart of Maasai land
              </span>
            </p>
            <p>
              🌍 Coordinates:{" "}
              <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">
                Available upon request
              </span>
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-2xl"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 hover:border-amber-400 transition-colors duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 hover:border-amber-400 transition-colors duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject of your message"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 hover:border-amber-400 transition-colors duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring-amber-500 hover:border-amber-400 transition-colors duration-300"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 text-gray-900 py-2 px-4 rounded-md transform transition-all duration-300 hover:bg-amber-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Send Message
            </button>
            {responseMessage && (
              <p className="text-center mt-4 bg-green-800 text-green-200 p-2 rounded transition-all duration-300">
                {responseMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-center mt-4 bg-red-800 text-red-200 p-2 rounded transition-all duration-300">
                {errorMessage}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;
