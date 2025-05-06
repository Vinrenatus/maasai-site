import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext.jsx'; // Corrected import path

const CheckoutModal = ({ onClose }) => {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      };

      const response = await axios.post(
        'http://localhost:5000/api/checkout',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Payment successful!');
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Select Payment Method</h2>
        <div className="mb-4">
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            Card
          </label>
          <label>
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
            />
            PayPal
          </label>
        </div>
        {paymentMethod === 'card' && (
          <div>
            <input
              type="text"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData({ ...formData, cardNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Expiry Date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CVV"
              value={formData.cvv}
              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
            />
          </div>
        )}
        {paymentMethod === 'paypal' && (
          <input
            type="email"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
          />
        )}
        <button onClick={handleCheckout} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Pay Now
        </button>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;