import React from 'react'
import { useEffect, useState, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Filter from '../components/Filter.jsx'
import Card from '../components/Card.jsx'
const LazyMap = React.lazy(() => import('../components/Map.jsx'));
import apiRequest from '../utils/apiRequest.js'
import { motion, AnimatePresence } from 'framer-motion'
const API_URL = import.meta.env.VITE_API_URL;
 
const Lists = () => {
  const location = useLocation();
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [posts, setPosts] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [refresh, setRefresh] = useState(false)
  
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (let [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true)
      try {
        const queryParams = getQueryParams();
        console.log(queryParams);
        const res = await apiRequest.get(`${API_URL}/api/posts`, { params: queryParams });
        console.log(res.data)
        setPosts(res.data.posts)
        setIsFetching(false)
      } catch (error) {
        setIsFetching(false)
        console.error(error)
      }
    }
    fetchPosts()
  }, [location.search, refresh])


  return (
    <div className='flex flex-col lg:flex-row h-full  '>
      <div className='list-part  flex-1 overflow-y-auto'>
        <div className='p-4 flex flex-col gap-6 pb-10'>

          <Filter/>
          
          {isFetching ? <div className="flex justify-center items-center bg-white">
              <span className="loader" />
            </div>  :<>
            {posts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card item={item} key={item.id} setRefresh={setRefresh}/>
              </motion.div>
            ))}
            </>
          }
        </div>
      </div>

      <div className="flex flex-col lg:hidden p-4">
      <button
        className="bg-yellow-800 text-white py-2 px-4 rounded-md"
        onClick={() => setIsMapVisible(!isMapVisible)}
        aria-label="Show Map"
      >
        {isMapVisible ? 'Hide Map' : 'Show Map'}
      </button>
    </div>
      <div className={`map-part lg:flex-1 ${isMapVisible? '' : 'hidden'} lg:block bg-[#fcf5f3] h-full`}>
        <motion.div
              className="map-part lg:flex-1 bg-[#fcf5f3] h-full"
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <Suspense fallback={<div className='absolute inset-0 shimmer'></div>}>
                <LazyMap items={posts} />
              </Suspense>
          </motion.div>
      </div>
    </div>
  )
}

export default Lists
