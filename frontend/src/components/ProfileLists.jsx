import React from 'react'
import { useState, useEffect } from 'react'
import Card from './Card.jsx'
import apiRequest from '../utils/apiRequest.js'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL;

const ProfileList = ({listType, refreshPosts}) => {
  const [profilePosts, setProfilePosts] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setIsFetching(true)
      try {
        if (listType === 'user') {
          const res = await apiRequest.get(`${API_URL}/api/auth/userPosts`)
          setProfilePosts(res.data.userPosts)
          return
        }
        else if (listType === 'saved') {
          const res = await apiRequest.get(`${API_URL}/api/auth/savedPosts`)
          setProfilePosts(res.data.savedPosts)
        }
        else {
          toast.error('Invalid Category of Listings')
          return
        }
      } catch (error) {
        console.error('Error fetching saved posts:', error)
      }
      finally {
        setIsFetching(false)
      }
    }
    fetchSavedPosts()
  }, [refreshPosts, refresh])


  return (
    <div className='flex flex-col gap-8'>

        {isFetching ? <div className="flex justify-center items-center bg-white ">
            <span className="loader" />
          </div>  : <>
          {profilePosts.map((item, index) => (
            <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ pointerEvents: "auto" }}
          >
            <Card key={item.id} item={item} profileList={true} setRefresh={setRefresh}/>
          </motion.div>
          ))}

          {profilePosts.length === 0 && <h1>{listType==="saved"? "You haven't saved any Listing":"You haven't created any Listing"}</h1>}
          </>
        }

    </div>
  )
}

export default ProfileList