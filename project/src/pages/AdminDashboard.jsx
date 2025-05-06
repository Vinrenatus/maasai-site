import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { FaArrowRight, FaEdit, FaTrash } from "react-icons/fa";

// Utility function to create a snippet from the content
const getSnippet = (content, maxLength = 100) => {
  if (!content) return "";
  const text = content.replace(/<[^>]+>/g, ""); // Remove HTML tags
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("news");
  const [data, setData] = useState({ news: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // For modals
  const [modalType, setModalType] = useState(""); // 'add', 'edit'
  const [selectedItem, setSelectedItem] = useState(null); // Item being edited

  // Fetch admin dashboard data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          response.data &&
          Array.isArray(response.data.news) &&
          Array.isArray(response.data.products)
        ) {
          setData(response.data);
        } else {
          console.error("Unexpected data format from /api/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle CRUD operations
  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(
          `http://localhost:5000/api/${type === "news" ? "news" : "products"}/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        alert(`${type} deleted successfully!`);
        setData((prevData) => ({
          ...prevData,
          [type]: prevData[type].filter((item) => item.id !== id),
        }));
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const handleEdit = (type, item) => {
    setModalType("edit");
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleAdd = (type) => {
    setModalType("add");
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleSubmit = async (type, formData) => {
    try {
      let response;
      if (modalType === "add") {
        response = await axios.post(
          `http://localhost:5000/api/${type === "news" ? "news" : "products"}`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        alert(`${type} added successfully!`);
        setData((prevData) => ({
          ...prevData,
          [type]: [...prevData[type], response.data],
        }));
      } else if (modalType === "edit") {
        response = await axios.put(
          `http://localhost:5000/api/${type === "news" ? "news" : "products"}/${selectedItem.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        alert(`${type} updated successfully!`);
        setData((prevData) => ({
          ...prevData,
          [type]: prevData[type].map((item) =>
            item.id === selectedItem.id ? { ...item, ...response.data } : item
          ),
        }));
      }
      setShowModal(false);
    } catch (error) {
      console.error(`Error handling ${type}:`, error);
    }
  };

  // Render sections with CRUD buttons
  const renderSection = () => {
    switch (activeSection) {
      case "news":
        return (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Manage News Articles
            </h2>
            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.news.map((item) => (
                <article
                  key={item.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {/* Image */}
                  <img
                    src={item.image_url || "https://via.placeholder.com/600"}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                      {item.title}
                    </h2>
                    <p>{getSnippet(item.content)}</p>
                    <footer className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.created_at}</span>
                      <div className="flex space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit("news", item)}
                          className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete("news", item.id)}
                          className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
            {/* Add News Button */}
            <button
              onClick={() => handleAdd("news")}
              className="mt-8 block mx-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Add News Article
            </button>
          </div>
        );

      case "products":
        return (
          <div>
            <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Manage Products
            </h2>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-700 p-6 rounded-lg bg-gray-800 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Product Image */}
                  <img
                    src={product.image_url || "https://via.placeholder.com/600"}
                    alt={product.name}
                    className="w-full h-56 object-cover mb-4 rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                  {/* Product Name */}
                  <h2 className="text-xl font-bold text-gray-100">{product.name}</h2>
                  {/* Product Price */}
                  <p className="text-2xl font-extrabold text-amber-400 my-2">${product.price}</p>
                  {/* Product Description */}
                  <p className="mt-2 text-gray-300 text-justify">{getSnippet(product.description, 150)}</p>
                  {/* CRUD Buttons */}
                  <div className="mt-4 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit("product", product)}
                      className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete("product", product.id)}
                      className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Product Button */}
            <button
              onClick={() => handleAdd("product")}
              className="mt-8 block mx-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Add Product
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Modal for Add/Edit
  const renderModal = () => {
    if (!showModal) return null;

    const initialFormData =
      modalType === "edit" && selectedItem
        ? { ...selectedItem }
        : { title: "", content: "", image_url: "" };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSubmit(activeSection, Object.fromEntries(formData));
          }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            {modalType === "add" ? "Add" : "Edit"} {activeSection === "news" ? "News" : "Product"}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={initialFormData.title || ""}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {activeSection === "news" ? "Content" : "Description"}
            </label>
            <textarea
              name="content"
              defaultValue={initialFormData.content || ""}
              required
              rows="4"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>
          {activeSection === "products" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={initialFormData.price || ""}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image_url"
              defaultValue={initialFormData.image_url || ""}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Handle loading state
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-300">
      <div className="max-w-7xl mx-auto p-8">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {/* Main Content */}
        <div className="flex-grow p-4">{renderSection()}</div>
      </div>
      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminDashboard;