// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL;
import apiRequest from '../utils/apiRequest.js';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending message...");
    
    try {
      const res = await apiRequest.post(`${API_URL}/api/contact`, formData);
      
      toast.dismiss(toastId);
      
      if (res.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full bg-[#fcf5f3] text-gray-800 p-6 overflow-y-auto">

      <motion.div
        className="md:w-1/2 flex flex-col items-start md:items-start mb-8 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-md max-w-md mb-4">
          Have questions or need assistance? We're here to help. Fill out the form, and we'll get back to you as soon as possible.
        </p>
        <p className="text-md max-w-md">
          You can also reach us at:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Email:</strong> support@example.com
          </li>
          <li>
            <strong>Phone:</strong> +91 01234 56789
          </li>
          <li>
            <strong>Address:</strong> 123 Behind, You, Watch Out
          </li>
        </ul>
      </motion.div>

      <motion.form
        className="md:w-1/2 w-full max-w-md bg-white p-8 rounded-md shadow-md"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
            Message
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 resize-none"
            name="message"
            id="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        <motion.button
          className="w-full bg-yellow-400 text-black font-bold py-3 px-4 rounded hover:bg-yellow-500 focus:outline-none focus:shadow-outline"
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Contact;