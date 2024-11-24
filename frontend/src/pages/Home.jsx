import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegBuilding } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";

function HomePage() {

  const statsData = [
    { 
      icon: FaRegBuilding , 
      number: "20+", 
      text: "Years of Experience" 
    },
    { 
      icon: FaAward,
      number: "200", 
      text: "Awards Gained" 
    },
    { 
      icon: IoHomeOutline, 
      number: "2000+", 
      text: "Properties Ready" 
    }
  ];

  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatIndex((prevIndex) => 
        prevIndex === statsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 1500);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="flex h-full">
      <div className="flex-1 flex">
        <div className='flex flex-col sm:justify-center gap-4 h-full px-24 lg:pr-12 md:pr-0 justify-start'>
            <h1 className="lg:text-5xl text-3xl lg:mt-0 mt-10  font-semibold">
            Find Real Estate & Get Your Dream Place
          </h1>
          <p>
            We have the best properties for you. Get your dream place today.
          </p>
          <SearchBar />

          {/* for large screens */}
      <motion.div 
        className="stats lg:flex justify-between hidden gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <stat.icon className="w-8 h-8 mb-3 text-yellow-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            {stat.number}
          </h1>
          <h2 className="text-gray-600 font-medium mt-2">{stat.text}</h2>
        </motion.div>
      ))}
    </motion.div>

    {/* for small screens */}
    <motion.div 
      className="stats flex lg:hidden justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatIndex}
          className="flex flex-row gap-2 items-center text-center p-6 bg-white rounded-xl shadow-sm w-64"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >

        {(() => {
          const IconComponent = statsData[currentStatIndex].icon;
          return <IconComponent className="w-8 h-8 mb-3 text-yellow-600" />;
        })()}

          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            {statsData[currentStatIndex].number}
          </h1>
          <h2 className="text-gray-600 font-medium mt-2">{statsData[currentStatIndex].text}</h2>
        </motion.div>
      </AnimatePresence>
    </motion.div>
          
        </div>
      </div>

      {/* img container */}
      <motion.div 
        className="bg-[#fcf5f3] relative hidden md:flex flex-1 items-center overflow-hidden"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer" />
        )}
        <motion.img
          src="./bg.webp"
          alt='Background'
          className="absolute right-0 w-[115%] lg:w-[105%] h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcf5f3] via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}

export default HomePage;