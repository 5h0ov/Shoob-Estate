import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRegBuilding, FaAward } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#fcf5f3] text-gray-800 overflow-y-auto">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Us
      </motion.h1>
      <motion.p
        className="text-lg max-w-2xl text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Welcome to our platform! We are committed to helping you find your dream property with ease and confidence. Our team has over 16 years of experience in the real estate industry, providing top-notch services and gaining numerous awards along the way.
      </motion.p>
      <motion.div
        className="flex flex-wrap justify-center gap-8 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
        >
          <FaRegBuilding className="w-16 h-16 mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold">16+</h2>
          <p className="text-gray-600">Years of Experience</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
        >
          <FaAward className="w-16 h-16 mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold">200</h2>
          <p className="text-gray-600">Awards Gained</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
        >
          <IoHomeOutline className="w-16 h-16 mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold">2000+</h2>
          <p className="text-gray-600">Properties Ready</p>
        </motion.div>
      </motion.div>
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link
          to="/list"
          className="px-6 py-3 bg-yellow-400 rounded-md text-lg font-bold hover:bg-yellow-500 active:bg-yellow-600 transition-all"
        >
          View Listings
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 bg-gray-300 rounded-md text-lg font-bold hover:bg-gray-400 active:bg-gray-500 transition-all"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
};

export default About;