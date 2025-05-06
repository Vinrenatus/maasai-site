import React, { useState, useEffect } from "react";
import axios from "axios";

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Order History</h1>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id} className="border-b py-4">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Total Amount:</strong> ${order.total_amount}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Date:</strong> {order.created_at}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}

export default OrderHistory; // Default export