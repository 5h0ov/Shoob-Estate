// frontend/src/components/Filter.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterQuery, setFilterQuery] = useState({});

  const [disabledSearch, setDisabledSearch] = useState(true);

  useEffect(() => {
    setFilterQuery({
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || '',
      propertyType: searchParams.get('propertyType') || '',
      bedroom: searchParams.get('bedroom') || 0,
      minPrice: searchParams.get('minPrice') || 0,
      maxPrice: searchParams.get('maxPrice') || 1000000,
    });
  }, [searchParams]);

  useEffect(() => {
    if (
      filterQuery.location === '' &&
      filterQuery.type === '' &&
      filterQuery.propertyType === '' &&
      filterQuery.bedroom === 0 &&
      filterQuery.minPrice === 0 &&
      filterQuery.maxPrice === 1000000
    ) {
      setDisabledSearch(true);
    } else {
      setDisabledSearch(false);
    }
  }, [filterQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (disabledSearch) {
      toast.info('Please enter some filters to search');
      return;
    }
    if (parseFloat(filterQuery.minPrice) > parseFloat(filterQuery.maxPrice)) {
      toast.info('Max Price should be greater than Min Price');
      return;
    }
    setSearchParams(filterQuery);
    toast.success('Filters Applied');
  };

  const handleClear = () => {
    setFilterQuery({
      location: '',
      type: '',
      propertyType: '',
      bedroom: 0,
      minPrice: 0,
      maxPrice: 1000000,
    });
    setSearchParams({});
    toast.success('Filters Cleared');
  };

  return (
    <motion.div
      className="flex flex-col gap-2 pr-10 pb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-normal">
        Search results for{' '}
        <span className="font-bold">
          {searchParams.get('location') || 'All Locations'}
        </span>
      </h1>
      <motion.div
        className="text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="city">Location</label>
          <input
            className="w-full p-2 border border-gray-400 rounded-md text-base font-bold"
            type="text"
            id="location"
            name="location"
            placeholder="City Location"
            onChange={handleChange}
            value={filterQuery.location || ''}
          />
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-5 text-lg"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {/* Type */}
        <motion.div
          className="flex flex-col gap-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label htmlFor="type">Type</label>
          <select
            className="w-36 p-2 border border-gray-400 rounded-md text-base font-bold"
            name="type"
            id="type"
            onChange={handleChange}
            value={filterQuery.type || ''}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </motion.div>
        {/* Property Type */}
        <motion.div
          className="flex flex-col gap-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label htmlFor="propertyType">Property Type</label>
          <select
            className="w-36 p-2 border border-gray-400 rounded-md text-base"
            name="propertyType"
            id="propertyType"
            onChange={handleChange}
            value={filterQuery.propertyType || ''}
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </motion.div>
        {/* Bedroom */}
        <motion.div
          className="flex flex-col gap-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label htmlFor="bedroom">Bedroom</label>
          <input
            className="w-36 p-2 border border-gray-400 rounded-md text-base"
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            value={filterQuery.bedroom !== 0 ? filterQuery.bedroom : ''}
            max={20}
          />
        </motion.div>
        {/* Min Price */}
        <motion.div
          className="flex flex-col gap-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label htmlFor="minPrice">Min Price</label>
          <input
            className="w-36 p-2 border border-gray-400 rounded-md text-base"
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            min={0}
            onChange={handleChange}
            value={filterQuery.minPrice !== 0 ? filterQuery.minPrice : ''}
            max={1000000}
          />
        </motion.div>
        {/* Max Price */}
        <motion.div
          className="flex flex-col gap-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <label htmlFor="maxPrice">Max Price</label>
          <input
            className="w-36 p-2 border border-gray-400 rounded-md text-base"
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            min={0}
            onChange={handleChange}
            value={filterQuery.maxPrice !== 1000000 ? filterQuery.maxPrice : ''}
            max={1000000}
          />
        </motion.div>
        {/* Buttons */}
        <motion.div
          className="flex flex-row gap-2 mt-4 items-end"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <button
            className={`w-32 h-full p-2 bg-yellow-400 rounded-md flex items-center justify-center transition-all ${
              disabledSearch
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:bg-yellow-500 active:bg-yellow-600'
            }`}
            onClick={handleSubmit}
            disabled={disabledSearch}
            aria-label="Search"
          >
            <FaSearch className="size-7" />
          </button>
          <button
            className={`w-32 h-full p-2 bg-red-300 rounded-md font-bold flex items-center justify-center transition-all ${
              disabledSearch
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:bg-red-400 active:bg-red-500'
            }`}
            onClick={handleClear}
            disabled={disabledSearch}
            aria-label='Clear'
          >
            Clear
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Filter;