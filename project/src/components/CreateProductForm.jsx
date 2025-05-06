import React, { useState } from 'react';
import axios from 'axios';

const CreateProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { 
        name, 
        price: parseFloat(price), 
        description, 
        image_url: imageUrl 
      };
      await axios.post('http://localhost:5000/api/product', productData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Product created successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setMessage('Error creating product.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Product</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default CreateProductForm;
