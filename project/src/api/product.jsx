import axios from 'axios';

export const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  try {
    const response = await axios.post('http://localhost:5000/api/product', productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw error;
  }
};
