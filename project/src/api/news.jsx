import axios from 'axios';

export const createNews = async (newsData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post('http://localhost:5000/api/news', newsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error.response.data);
    throw error;
  }
};
