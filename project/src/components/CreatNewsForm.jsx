import React, { useState } from 'react';
import axios from 'axios';

const CreateNewsForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newsData = { title, content, image_url: imageUrl };
      await axios.post('http://localhost:5000/api/news', newsData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('News created successfully!');
      setTitle('');
      setContent('');
      setImageUrl('');
    } catch (err) {
      setMessage('Error creating news.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
      <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create News</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default CreateNewsForm;
