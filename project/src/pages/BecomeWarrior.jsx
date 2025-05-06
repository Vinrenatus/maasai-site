import React, { useState } from "react";
import woodencertificate from "../assets/woodencertificate.jpeg";
import limitedspots from '../assets/limitedspots.jpeg';
import certificate from '../assets/certificate.jpeg';
import conservancy from '../assets/conservancy.jpg';
import squareinch from '../assets/square inch.jpeg';
import discounts from '../assets/discounts.jpeg'


function BecomeWarrior() {
  const benefits = [
    {
      title: "Official Maasai Warrior Certificate",
      description:
        "📜 Earn a prestigious certificate officially recognized by the Maasai community, symbolizing your warrior status.",
      imgSrc: certificate,
      alt: "Maasai Warrior Certificate"
    },
    {
      title: "A square inch of land",
      description:
        "🌍 Own a Piece of Maasai Heritage. Secure a symbolic stake in Maasai land, representing your dedication to cultural preservation and conservation efforts. Immerse yourself in authentic warrior traditions through exclusive access to sacred ceremonies.",
      imgSrc: squareinch,
      alt: "Square Inch of Land"
    },
    {
      title: "Special Merchandise Discounts 🛍️",
      description:
        "🔥 Exclusive Warrior Gear & Handcrafted Artifacts 🔥. Gain privileged access to authentic Maasai warrior merchandise. Enjoy special discounts as part of this elite community.",
      imgSrc: discounts,
      alt: "Merchandise Discounts"
    },
    {
      title: "One acre of conservancy",
      description:
        "🏞️ Preserve, Protect, and Belong. Claim one acre of protected Maasai conservancy as a symbol of your warrior commitment.",
      imgSrc: conservancy,
      alt: "Conservancy Land"
    },
    {
      title: "Limited Spots Available",
      description:
        "⚡ Scarcity Makes Legends—Secure Your Title! Only a select number of honorary warrior titles are awarded.",
      imgSrc: limitedspots,
      alt: "Limited Spots"
    },
    {
      title: "Wooden Warrior Certificate 🏆",
      description:
        "🔥 Honor. Legacy. Authenticity. 🔥 Receive a handcrafted wooden certificate symbolizing your official recognition.",
      imgSrc: woodencertificate,
      alt: "Wooden Warrior Certificate"
    }
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    phone: "",
    reason: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        age: calculateAge(formData.dob),
        phone: formData.phone,
        reason: formData.reason,
      };

      const response = await fetch("http://localhost:5000/api/warrior-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Application sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          dob: "",
          phone: "",
          reason: "",
        });
      } else {
        setMessage(data.error || "Error submitting application. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Error submitting application. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          🌍 Become a Maasai Warrior
        </h1>
        <p className="text-lg text-gray-300 mt-4">
          Step into the legacy—embrace the spirit, culture, and strength of the Maasai warriors!
        </p>
      </header>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
          >
            <img
              src={benefit.imgSrc}
              alt={benefit.alt || benefit.title}
              className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 transform hover:scale-105"
            />
            <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {benefit.title}
            </h3>
            <p className="text-gray-300 mt-2">{benefit.description}</p>
          </div>
        ))}
      </section>

      {/* Application Form Section */}
      <section className="mt-16 max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-6">
          🏹 Warrior Application
        </h2>
        <p className="text-lg text-center text-gray-300 mb-6">
          Secure your honorary warrior title today!
        </p>

        {message && (
          <div
            className={`p-4 rounded mb-4 text-center transition-all duration-300 ${
              message.startsWith("Application sent")
                ? "bg-green-800 text-green-200"
                : "bg-red-800 text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-2 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 transition duration-300 hover:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 transition duration-300 hover:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              placeholder="Select your birth date"
              value={formData.dob}
              onChange={handleChange}
              className="mt-2 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 transition duration-300 hover:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 transition duration-300 hover:border-amber-400"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300">
              Why do you want to become a Maasai Warrior?
            </label>
            <textarea
              name="reason"
              placeholder="Tell us why you want to become a Maasai Warrior"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="mt-2 block w-full bg-gray-700 text-gray-100 rounded-md border border-gray-600 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 transition duration-300 hover:border-amber-400"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 text-gray-900 py-3 px-4 rounded-md hover:bg-amber-600 transition duration-300"
          >
            Submit Application
          </button>
        </form>
      </section>
    </div>
  );
}

export default BecomeWarrior;
