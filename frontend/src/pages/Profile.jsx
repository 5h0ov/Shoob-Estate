import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProfileLists from '../components/ProfileLists.jsx'
import Chat from '../components/Chat.jsx'
import UpdateModal from '../components/UpdateModal.jsx'
import { useStore } from '../store/store.js'
import apiRequest from '../utils/apiRequest.js'
import { IoMdRefresh } from "react-icons/io";
import { Tooltip } from 'react-tooltip'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL

const Profile = () => {
  const [isMessagesVisible, setIsMessagesVisible] = useState(false)
  const { logout, isLoggingOut }  = useStore()
  const { user, updateUser, initializeSocket, isConnectingSocket, isSocketConnected } = useStore()
  const [openModal, setOpenModal] = useState(false)
  const [fetchingChats, setFetchingChats] = useState(true)
  const [resData , setResData] = useState([])
  const [refreshChats, setRefreshChats] = useState(false)
  const [refreshPosts, setRefreshPosts] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     initializeSocket();
  //   }
  // }, [user]);


  useEffect(() => {
      const fetchChats = async () => {
        setFetchingChats(true)
        try{
          const res = await apiRequest.get(`${API_URL}/api/chat`)
          // console.log(res.data)
          setResData(res.data)
        } catch (error) {
          console.error(error)
        }
        finally {
          setFetchingChats(false)
        }
    }

    fetchChats()
  }, [refreshChats])
  
  const handleLogOut = async () => {
    await logout()
  }

  const handleModal = () => {
    setOpenModal(!openModal)
  }

  const handleRoleChange = async (newRole) => {
    try {
      await updateUser({ role: newRole });
      setShowRoleDialog(false); 
    } catch (error) {
      console.error(error);
    }
  };

  // if (isConnectingSocket || !isSocketConnected) {
  //   return (
  //     <div className="flex flex-col gap-2 justify-center items-center h-screen">
  //       <span className="loader-eye" />
  //       <span className='text-2xl font-semibold'>
  //         {isConnectingSocket ? 'Socket is Connecting...' : 'Waiting for Socket Connection...'}
  //       </span>
  //       <span className='text-2xl font-semibold'>
  //         Please be patient, it can take a while as it's hosted on Render.
  //       </span>
  //     </div>
  //   );
  // }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isConnectingSocket || !isSocketConnected) {
        setShowTimeout(true);
      }
    }, 10000); // Show timeout message after 10 seconds

    return () => clearTimeout(timer);
  }, [isConnectingSocket, isSocketConnected]);

  if (isConnectingSocket || !isSocketConnected) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <span className="loader-eye" />
        <span className='text-2xl font-semibold'>
          {isConnectingSocket ? 'Socket is Connecting...' : 'Waiting for Socket Connection...'}
        </span>
        {showTimeout && (
          <span className='text-xl text-yellow-600 font-semibold'>
            Connection is taking longer than usual. This might be because the server needs to wake up from sleep mode.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col lg:flex-row'>
      <motion.div
        className='main-info overflow-y-auto pb-10'
        style={{ flex: 1 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='wrapper mx-5 flex flex-col gap-6'>
          <motion.div
            className='flex items-center justify-between'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className='text-3xl font-bold'>User Info</h1>
            <button
              className='py-2 px-4 bg-yellow-400 rounded-md text-lg font-bold cursor-pointer hover:bg-yellow-500 active:bg-yellow-600'
              onClick={handleModal}
            >
              Update Profile
            </button>
          </motion.div>
          <motion.div
            className='info flex flex-col gap-2'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.span
              className='flex flex-row gap-2 items-center text-2xl font-semibold'
            >
              Avatar:
              <img
                src={user.avatar || './blank_avatar.png'}
                alt=''
                className='w-12 h-12 rounded-full object-cover'
              />
            </motion.span>
            <span className='font-semibold'>
              Username: <b>{user.username}</b>
            </span>
            <span className='font-semibold'>
              E-mail: <b>{user.email}</b>
            </span>
            <span className='font-semibold text-xl'>
              Role: <b>{user.role || 'Not Selected'}</b>
            </span>
            <button
              disabled={isLoggingOut}
              onClick={handleLogOut}
              className={`w-fit py-3 px-3 font-bold ml-1 mt-2 text-white rounded-md bg-teal-700 hover:scale-105 transition-all duration-100 ${
                isLoggingOut ? 'bg-gray-300 cursor-not-allowed' : ''
              }`}
            >
              Log Out
            </button>
          </motion.div>
          <motion.div
            className='flex items-center justify-between'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            
            <h1 className='text-3xl font-bold'>My Listings</h1>
            {user.role === 'SELLER' ? (
              <Link
                to='/create-post'
                className='py-2 px-4 bg-yellow-400 rounded-md text-lg font-bold cursor-pointer hover:bg-yellow-500 active:bg-yellow-600'
              >
                Create New Listing
              </Link>
            ) : (
              <button
                onClick={() => setShowRoleDialog(true)}
                className='py-2 px-4 bg-yellow-400 rounded-md text-lg font-bold cursor-pointer hover:bg-yellow-500 active:bg-yellow-600'
              >
                Want to Create Your Own Listing?
              </button>
            )}
            
            <IoMdRefresh id="refresh-posts" className={`cursor-pointer relative shadow-md bg-white rounded-full size-10 p-1 ${fetchingChats ? 'animate-spin' : ''}  hover:bg-gray-100 transition-all hover:shadow-lg hover:scale-105 active:hover:scale-95`}  
            onClick={()=>setRefreshPosts(!refreshPosts)}/>

          <Tooltip anchorSelect='#refresh-posts' place='bottom' className='bg-black text-white rounded-md'>
            Refresh Posts
          </Tooltip>

          </motion.div>
          <ProfileLists listType='user' refreshPosts={refreshPosts} />

          <AnimatePresence>
          {showRoleDialog && (
            <motion.div
              className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'

            >
              <motion.div className='bg-white p-6 rounded-lg max-w-md w-full'
              initial={{ opacity: 0, y: 10, scaleX: 0.2 }}
              animate={{ opacity: 1, y: 0, scaleX: 1 }}
              exit={{ opacity: 0, y: 10, scaleX: 0.2 }}
              transition={{ duration: 0.25 }}
              >
                <h2 className='text-xl font-bold mb-4'>Become a Seller</h2>
                <p className='mb-4'>
                  To create listings, you need to change your role to Seller.
                </p>
                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => setShowRoleDialog(false)}
                    className='px-4 py-2 bg-gray-200 rounded-md'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRoleChange('SELLER')}
                    className='px-4 py-2 bg-yellow-400 rounded-md'
                  >
                    Change to Seller
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
          <motion.div
            className='flex items-center justify-between'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className='text-3xl font-bold'>My Saved Listings</h1>
          </motion.div>
          <ProfileLists listType='saved' refreshPosts={refreshPosts}/>
        </div>
      </motion.div>
      <button
        className="lg:hidden block bg-yellow-800 text-white py-2 px-4 rounded-md"
        onClick={() => setIsMessagesVisible(!isMessagesVisible)}
      >
        {isMessagesVisible ? 'Click to Hide Messages' : 'Click to Show Messages'}
      </button>
      
      <motion.div className={`chat bg-[#fcf5f3] h-full ${isMessagesVisible ? '' : 'hidden'} lg:block`} style={{flex: 1}}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
      >
        <div className="wrapper py-0 px-4 h-full">
        <div className='h-full flex flex-col mt-3'>
        <motion.h1
          className='flex flex-row justify-between text-3xl font-bold mb-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Messages 
          <IoMdRefresh id="refresh-chats" className={`cursor-pointer relative shadow-md bg-white rounded-full size-10 p-1 ${fetchingChats ? 'animate-spin' : ''}  hover:bg-gray-100 transition-all hover:shadow-lg hover:scale-105 active:hover:scale-95`}  
          onClick={()=>setRefreshChats(!refreshChats)}/>
          </motion.h1>
          <Tooltip anchorSelect='#refresh-chats' place='bottom' className='bg-black text-white rounded-md'>
            Refresh Chats
          </Tooltip>
          {fetchingChats ? <div className="flex justify-center items-center h-screen">
              <span className="chat-loader invert" />
            </div> :
                <Chat resData={resData} currUserId = {user.id} />
          }

          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {openModal && <UpdateModal onClose={handleModal} user={user}  />}
      </AnimatePresence>

    </div>
  )
}

export default Profile
