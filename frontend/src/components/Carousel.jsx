import React from 'react'
import { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({images}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const changeImage = (direction) => {
    if(direction === "left") {
      if(currentImageIndex === 0) {
        setCurrentImageIndex(images.length-1)
      } else {
        setCurrentImageIndex(currentImageIndex-1)
      }
    }
    if(direction === "right") {
      if(currentImageIndex === images.length-1) {
        setCurrentImageIndex(0)
      } else {
        setCurrentImageIndex(currentImageIndex+1)
      }
      if(images.length - 1 === currentImageIndex) {
        setCurrentImageIndex(0)
      }
    }
  }

    if(images.length === 0) {
      return (
        <div className='w-full h-64 text-4xl lg:text-5xl text-red-600 flex justify-center items-center'>
          <p>No Images to show</p>
        </div>
      )
    }



    return (
      // Main Images 
      <div className='w-full flex h-64 gap-3 mb-20'>
        <div className='bigImage' style={{ flex: 2 }}>
          <img src={images[0]} alt="bigImage" className='w-full h-full object-cover rounded-md cursor-pointer' onClick={() => setCurrentImageIndex(0)}/>
        </div>
        <div className='smallImages h-24 flex flex-col justify-between gap-4' style={{ flex: 1 }}>
          {images.slice(1, 4).map((image, index) => (
            <div key={index} className="relative">
              {!isLoaded && (
                <div className="absolute inset-0 shimmer rounded-md" />
              )}
              <img 
                src={image} 
                alt="smallImage" 
                className={`w-full h-full object-cover rounded-md cursor-pointer transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                onClick={() => setCurrentImageIndex(index+1)}
                onLoad={() => setIsLoaded(true)}
              />
              {index === 2 && images.length > 4 && (
                <div 
                  className='absolute inset-0 bg-black/50 rounded-md flex items-center justify-center cursor-pointer'
                  onClick={() => setCurrentImageIndex(3)}
                >
                  <span className='text-white font-bold text-4xl'>
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
  
      <AnimatePresence>
      {/* Main Carousel */}
      {currentImageIndex !== null && (
        <motion.div className='carousel flex justify-center items-center absolute h-screen w-screen top-0 left-0 bg-black/85 backdrop-blur-sm z-20'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
          <FaArrowLeft className='cursor-pointer size-20 invert' style={{flex: 1}}
           onClick={()=>changeImage("left")} />
          <motion.div className='flex items-center gap-3 max-w-full max-h-full' style={{flex: 10}}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          >
            <img src={images[currentImageIndex]} alt="" className=''/>
          </motion.div>
          <FaArrowRight className='cursor-pointer size-20 invert' style={{flex: 1}}
           onClick={()=>changeImage("right")} />
          <IoMdClose className='cursor-pointer size-20 invert absolute top-0 right-0 p-4'
          onClick={() => setCurrentImageIndex(null)}/>
        </motion.div>
      )}
      </AnimatePresence>
      
    </div>
  )
}

export default Carousel