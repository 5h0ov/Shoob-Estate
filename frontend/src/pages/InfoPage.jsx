import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel.jsx'
import { FaEdit } from 'react-icons/fa';
import { IoMdPin } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkCheck } from 'react-icons/ci';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { MdOutlinePets } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaSchool } from "react-icons/fa";
import { TbBusStop } from "react-icons/tb";
import { RiRestaurantLine } from "react-icons/ri";
import { BiArea } from "react-icons/bi";
import { FaHouse } from "react-icons/fa6";
const LazyMap = React.lazy(() => import('../components/Map.jsx'));
import { toast } from 'react-toastify';
import apiRequest from '../utils/apiRequest.js';
import { useStore } from '../store/store.js';
import MessageDialog from '../components/MessageDialog.jsx';
import { motion } from 'framer-motion';
// import { useStore } from '../store/store.js';

const API_URL = import.meta.env.VITE_API_URL;

const InfoPage = () => {
  const windowUrl = window.location.search;
  // const searchParams = new URLSearchParams(windowUrl); 
  const {id} = useParams();
  // const preview = searchParams.get("preview"); 
  // console.log(preview);
  const {user} = useStore();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({})
  const [postDetails, setPostDetails] = useState({})
  // const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true); 
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false)
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('jwt-shoobestate');

        const res = await apiRequest.get(`${API_URL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // console.log(res.data);

        const { PostDetails, ...postWithoutDetails } = res.data.post; // destructuring the post details from the response
        setPostData(postWithoutDetails);
        setPostDetails(PostDetails);
        setIsSaved(res.data.isSaved);
        setIsLoading(false); 

      } catch (error) {
        console.error(error);
        console.log(error.response.data.message);

        if(error.response.status === 404) {
            setIsLoading(false);
            setPostData(null);
            console.log("Post not found. Please go back and try again");
            toast.error("Post not found. Please go back and try again");
            return;
          }
  
          toast.error("Failed to fetch post. Please go back and try again");
        setIsLoading(false); 
    }
  }
  fetchPost();
  },[id])

  
  // console.log("postData: ",postData);
  // console.log("postDetails: ",postDetails);
  if (isLoading) {
    return <div className="flex justify-center items-center bg-white h-screen">
        <span className="loader" />
    </div> 
  }

  const handleSave = async () => {

    if(!user) {
      toast.error("You need to be logged in to Bookmark Posts!");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('jwt-shoobestate');
      const res = await apiRequest.post(`${API_URL}/api/auth/savePost`, {postId: postData.id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);

      if(res.data.deleted) {
        setIsSaved(false);
      } else {
        setIsSaved(true);
      }
      setIsSaving(false);
      toast.success(res.data.message);
      
    }
    catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to save post. Please try again.");
      setIsSaving(false);
    }
  }

  if(!postData) {
    return (
      <div className="flex justify-center items-center bg-white h-screen">
      <h1 className="text-4xl text-black">Post not found. Please go back and try again</h1>
    </div>
    )
  }
  
  return (
    <div className='flex lg:flex-row flex-col h-full'>
      <motion.div 
      className='info flex-1 h-full overflow-y-auto'
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      >
        <div className='wrapper pr-4 sm:pr-12 pl-4'>

          <Carousel images={postData.images} />

          <motion.div 
          className='details'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className='flex  justify-between'>
                <motion.div 
                  className='flex flex-col gap-5'
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5 }}
                >
                    <h1 className='text-4xl font-semibold'>{postData.title}</h1>
                    <div className='flex gap-3 flex-col'>
                      <p className='flex items-center gap-1 text-gray-500 font-medium text-sm'>
                        <IoMdPin className='inline-block size-4'/>
                        <span>{postData.address}</span>
                      </p>  
                      <p className='text-lg p-2 rounded-lg bg-green-200 font-bold w-max'>$ {postData.price}</p>
                    </div>
                </motion.div>
                <motion.div 
                  className="user flex flex-col p-5 bg-yellow-100 rounded-md items-center gap-2 z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={postData.user.avatar} alt="user image" className='object-cover w-12 h-12 rounded-full' />
                <span className='font-bold'>{postData.user.username}</span>
              </motion.div>
          </div>

          {user && user.id === postData.userID && (
            <button
              aria-label='Edit Post'
              className='mt-3 flex flex-row  gap-1 bg-yellow-400 font-bold  py-2 px-4 rounded-md'
              onClick={() => navigate(`/create-post?id=${postData.id}`)}
            >
              Edit This Listing<FaEdit size={24} />
            </button>
          )}
          <div className='mt-8 mb-10 ' 
          dangerouslySetInnerHTML={{__html: postDetails.description}}>

          </div>
        </motion.div>
      </div>
    </motion.div>

    <button
        className="lg:hidden block bg-yellow-800 text-white py-2 px-4 rounded-md"
        onClick={() => setIsFeaturesVisible(!isFeaturesVisible)}
      >
        {isFeaturesVisible ? 'Click to Hide Details' : 'Click to Show Details'}
      </button>

      <motion.div className={`features bg-[#fcf5f3] lg:flex-1 overflow-y-auto ${isFeaturesVisible ? '' : 'hidden'} lg:block`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }} 
      >
        <motion.div className='wrapper py-0 px-4' >
           <p className='font-bold text-lg mb-2'>General</p>
           <motion.div className='general-info mb-2 flex flex-col gap-2 bg-white rounded-md py-3 px-2'
            variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          animate="visible"
           >  
              <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <FaHouse className='size-10 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md '/>
                <div className='flex flex-col'>
                  <span className='font-bold'>Property Type</span>
                  <span className='capitalize'>
                    {postData.propertyType}
                  </span>
                </div>
              </motion.div>
            <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <BsTools className='size-10 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md '/>
                <div className='flex flex-col'>
                  <span className='font-bold'>Furniture/Utilities</span>
                  <span className=''>
                    {postDetails.furnitures === "owner" ? "Owner provides" : "Tenant will provide"} furniture
                  </span>
                </div>
              </motion.div>
              <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <MdOutlinePets className='size-10 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/>
                <div className='flex flex-col'>
                  <span className='font-bold'>Pets?</span>
                  <span className=''>
                    {postDetails.petPolicy ? "Pets are allowed" : "No pets are allowed"}
                  </span>
                </div>
              </motion.div>
              <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <FaMoneyBillWave className='size-10 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/>
                <div className='flex flex-col'>
                  <span className='font-bold'>Rent Policy</span>
                  <span className=''>{postDetails.rentPolicy}</span>
                </div>  
              </motion.div>
           </motion.div>
           <p className='font-bold text-lg'>Sizes</p>
           <motion.div className='size-info mb-2 flex flex-row gap-2 justify-between'
            variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          animate="visible"
          >
            <motion.div className='flex flex-row items-center  gap-2  bg-white rounded-md py-4 px-2 '
              variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            > 
                <BiArea className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/><span className='font-bold flex flex-col sm:flex-row items-center sm:gap-1'>Area: <span>{postDetails.size} m²</span></span>
            </motion.div>
            <motion.div className='flex flex-row items-center  gap-2  bg-white rounded-md py-4 px-2 '
              variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            > 
                <FaBed className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/><span className='font-bold flex flex-col sm:flex-row items-center sm:gap-1'>Bedrooms: <span>{postData.bedroom}</span></span>
              </motion.div>
            <motion.div className='flex flex-row items-center  gap-2  bg-white rounded-md py-4 px-2 '
              variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            > 
                <FaBath className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/><span className='font-bold flex flex-col sm:flex-row items-center sm:gap-1'>Bathrooms: <span>{postData.bathroom}</span></span>
            </motion.div>
           </motion.div>

           <p className='font-bold text-lg'>Nearby Places</p>
           <motion.div className='nearby-info mb-2 flex flex-row gap-2 bg-white rounded-md py-3 px-2 justify-between'
           variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          animate="visible"
          >
            <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <FaSchool className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/>
                <div className='flex flex-col'>
                <span className='font-bold'>School</span>
                <p> 
                  {postDetails.schoolDist > 999
                  ? postDetails.schoolDist / 1000 + "km"
                  : postDetails.schoolDist + "m"}{" "} away
                </p>
                </div>
            </motion.div>
              <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <TbBusStop className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/>
                <div className='flex flex-col'>
                <span className='font-bold'>Bus Stop</span>
                <p> 
                  {postDetails.busStopDist > 999
                  ? postDetails.busStopDist / 1000 + "km"
                  : postDetails.busStopDist + "m"}{" "} away
                </p>
                </div>
            </motion.div>
              <motion.div 
                className='flex flex-row items-center gap-2'
                  variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              > 
                <RiRestaurantLine className='size-8 border shadow-md p-1 items-center flex justify-center text-yellow-800 rounded-md'/>
                <div className='flex flex-col'>
                <span className='font-bold'>Restaurant</span>
                <p> 
                  {postDetails.restaurantDist > 999
                  ? postDetails.restaurantDist / 1000 + "km"
                  : postDetails.restaurantDist + "m"}{" "} away
                </p>
                </div>
            </motion.div>

           </motion.div>
           <p className='font-bold text-lg mb-3'>Location</p>
           <div className='map w-full  h-52 '>
            <React.Suspense fallback={<div className='absolute inset-0 shimmer'></div>}>      
                <LazyMap items={[postData]}></LazyMap>
              </React.Suspense>
           </div>
           <p></p>
           <p></p>

          <motion.div className='flex flex-col sm:flex-row gap-2 justify-between mt-8 m-10'>
            <motion.button 
              className='flex flex-row gap-2 cursor-pointer border border-yellow-800 bg-white rounded-md py-4 px-2'
              whileHover={{ scale: 1.05, backgroundColor: "#f9f9f9" }}
              whileTap={{ scale: 0.98, backgroundColor: "#e2e8f0" }}
              onClick={handleSave}
            >
            {isSaved ?
              <>
                <CiBookmarkCheck className='size-7  cursor-pointer  items-center flex justify-center' />
                <span className='font-bold'>{isSaving 
                  ? "Removing Bookmark..." 
                  : (saveHovered ? "Remove Bookmark" : "Place is bookmarked")
                }</span>

              </>
              :
              <>
                <CiBookmark className='size-7  cursor-pointer  items-center flex justify-center '/><span className='font-bold'>{isSaving? "Saving..." : "Bookmark the Place"}</span>
              </>
            }
           </motion.button>
           <motion.button 
            className='flex flex-row gap-2 cursor-pointer border border-yellow-800 bg-white rounded-md py-4 px-2'
            whileHover={{ scale: 1.05, backgroundColor: "#f9f9f9" }}
            whileTap={{ scale: 0.98, backgroundColor: "#e2e8f0" }}
            onClick={() => {
              if (!user) {
                toast.error("You need to be logged in to send messages!");
                return;
              }
              else if(user.id===postData.userID) {
                toast.error("You can't send messages to yourself!");
                return;
              }
              setIsMessageDialogOpen(true);
            }}
          >
            <IoChatbubbleEllipsesOutline className='size-7 cursor-pointer items-center flex justify-center'/>
            <span className='font-bold'>Send Message</span>
          </motion.button>

          </motion.div>

        </motion.div>
      </motion.div>
      <MessageDialog 
        receiver={postData.user}
        receiverId={postData.userID}
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
      />
      </div>
  )
}

export default InfoPage