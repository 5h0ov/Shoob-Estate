import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { motion } from 'framer-motion';

const SearchBar = () => {
  const types = ["buy", "rent"];
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
    // console.log(query);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
    // console.log(query);
  };
  

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row lg:justify-between mb-4">
        <motion.div>
        {types.map((type) => (
          <motion.button
            key={type}
            onClick={() => switchType(type)}
            className={`px-9 py-4 border border-gray-300 capitalize cursor-pointer transition-colors ${
              query.type === type 
                ? "bg-black text-white border-slate-600" 
                : "hover:bg-gray-50"
            } ${
              type === "buy"
                ? "rounded-l-lg border-r-0"
                : "rounded-r-lg"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type}
          </motion.button>
        ))}
        </motion.div>
        <span className="flex items-center text-xl font-bold text-center"><span>Currently Searching for&nbsp;<span className='capitalize underline'>{(query.type)}</span></span></span>
      </div>
      <motion.form 
        className="bg-white rounded-lg shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="location"
            placeholder="City Location"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            onChange={handleChange}
          />
          <input
            type="number"
            name="minPrice"
            min={0}
            placeholder="Min Price"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
            placeholder="Max Price"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            onChange={handleChange}
          />
        </div>
        
        <Link 
          to={`/list?type=${query.type}&location=${query.location}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="w-full"
        >
          <motion.button
            className="w-full bg-yellow-500 text-black text-lg font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all active:bg-yellow-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch className="w-5 h-5" />
            <span>Search Properties</span>
          </motion.button>

        </Link>

        <Link to={'/list'} className="text-sm font-semibold hover:underline text-gray-500 block text-center mt-2">Or Search all available properties</Link>

      </motion.form>
    </div>
  );
}

export default SearchBar;