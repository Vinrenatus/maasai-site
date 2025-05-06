import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    // Calculate total price
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Handle checkout
    const handleCheckout = async () => {
        try {
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items to proceed.");
                return;
            }

            const token = localStorage.getItem("token"); // Retrieve token from storage
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            // Validate cart items
            const isValidCart = cartItems.every(
                (item) =>
                    item.id && typeof item.id === "number" &&
                    item.name && typeof item.name === "string" &&
                    item.price && typeof item.price === "number" &&
                    item.quantity && typeof item.quantity === "number"
            );
            if (!isValidCart) {
                alert("Invalid cart items. Please ensure all items have valid data.");
                return;
            }

            // Prepare payload
            const cartPayload = cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            }));

            // Validate total price
            if (isNaN(totalPrice) || totalPrice <= 0) {
                alert("Invalid total price. Please check your cart.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/checkout",
                {
                    items: cartPayload,
                    total: totalPrice,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }, // Include token in headers
                }
            );

            const { redirectUrl } = response.data;
            if (redirectUrl) {
                window.location.href = redirectUrl; // Redirect to Pesapal payment page
            } else {
                console.error("No redirect URL received from checkout.");
                alert("An error occurred during checkout. No redirect URL received.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            if (error.response && error.response.status === 422) {
                alert("Invalid checkout data. Please ensure your cart is not empty and all fields are correct.");
            } else if (error.response && error.response.status === 401) {
                alert("Unauthorized. Please log in again.");
            } else {
                alert("An error occurred during checkout. Please try again later.");
            }
        }
    };

    // Render empty cart message
    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                    Your Cart is Empty
                </h2>
                <p className="text-lg text-gray-300">Add some products to the cart to see them here.</p>
            </div>
        );
    }

    // Render cart items
    return (
        <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                Your Cart
            </h2>
            <ul className="space-y-6">
                {cartItems.map((item) => (
                    <li
                        key={item.id}
                        className="flex flex-col md:flex-row items-center justify-between border border-gray-700 p-6 rounded-md bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="w-full md:w-auto">
                            <h3 className="text-lg font-bold text-gray-100">{item.name}</h3>
                            <p className="text-gray-300">${item.price} x {item.quantity}</p>
                            <div className="flex items-center space-x-3 mt-3">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="bg-amber-500 text-gray-900 px-3 py-1 rounded hover:bg-amber-600 transition duration-300 disabled:opacity-50"
                                >
                                    –
                                </button>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="bg-amber-500 text-gray-900 px-3 py-1 rounded hover:bg-amber-600 transition duration-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
                <p className="text-xl font-bold text-gray-100">Total: ${totalPrice.toFixed(2)}</p>
                <button
                    onClick={handleCheckout}
                    className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                    Checkout
                </button>
            </div>
            <div className="mt-4">
                <button
                    onClick={clearCart}
                    className="text-red-500 underline transition-colors duration-300 hover:text-red-400"
                >
                    Clear Cart
                </button>
            </div>
        </div>
    );
};

export default Cart;