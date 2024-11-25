import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { IoMdPin } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import MessageDialog from './MessageDialog.jsx';
import { Tooltip } from 'react-tooltip'
import { useStore } from '../store/store.js';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from "react-icons/fa";
import apiRequest from '../utils/apiRequest.js';

const API_URL = import.meta.env.VITE_API_URL;

const Card = ({item, profileList, setRefresh }) => {
  const { user } = useStore();
  const [isSaved, setIsSaved] = useState(item.savedByUserIDs.includes(user?.id) || false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // auto carousel
  useEffect(() => {
    let interval;
    if (isInView && item.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === item.images.length - 1 ? 0 : prev + 1
        );
      }, 3000); // every 3 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or when `isInView` changes
  }, [isInView, item.images.length]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if(!user) {
      toast.error("You need to be logged in to Bookmark Posts!");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving...", { autoClose: false });
    try {
      const res = await apiRequest.post(`${API_URL}/api/auth/savePost`, {
        postId: item.id
      });
      
      setIsSaved(!isSaved);

      toast.dismiss(toastId);
      toast.success(res.data.message);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if(!confirm("Are you sure you want to delete this post?")) {
      toast.error("Post deletion cancelled!");
      return;
    };

    if(!user) {
      toast.error("You need to be logged in to delete Posts!");
      return;
    }
    
    const toastId = toast.loading("Deleting...", { autoClose: false });
    try {
      const res = await apiRequest.delete(`${API_URL}/api/posts/${item.id}`);

      toast.dismiss(toastId);
      toast.success(res.data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  }

  const handleEdit = (e) => {
    e.preventDefault();
    window.location.href = `/create-post?id=${item.id}`;
  }

  return ( <>
    <div className="flex flex-col p-4 sm:flex-row gap-5 shadow-lg hover:scale-105 transition-all duration-100 ease-out relative z-0">
    {user && user.id === item.userID && (
        <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-black px-2 py-1 rounded-md text-sm font-semibold shadow-md">
          Listed by you
        </div>
      )}
    <div className="flex-1 relative overflow-hidden">
          {/* Image with fade transition */}
          {!imageLoaded && item.images.length !== 0 && (
            <div className="absolute inset-0 shimmer" />
          )}
          <motion.img
            src={item.images[currentImageIndex]}
            alt=""
            className="w-full h-44 object-cover rounded-xl cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            onViewportEnter={() => setIsInView(true)} // Trigger when entering the viewport
            onViewportLeave={() => setIsInView(false)} // Trigger when leaving the viewport
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onClick={(e) => {
              e.preventDefault();
              if(!item.images[0]) return toast.error("No images to show");
              setSelectedImage(item.images[currentImageIndex]);
              setIsModalOpen(true);
            }}
          />
          
          {/* image indicators */}
          {item.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {item.images.map((indicator, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>


      <div className="flex-1 flex flex-col justify-between gap-2">
        <Link to={`/${item.id}`} className="text-decoration-none" aria-label='Visit'>
          <h2 className="font-semibold text-base text-gray-700 hover:text-black hover:scale-105 transition-all duration-100 ease-out">
            {item.title}
          </h2>
        </Link>
        <p className="flex items-center gap-1 text-gray-500 font-medium text-sm">
          <IoMdPin className="inline-block" />
          <span>{item.address}</span>
        </p>
        <p className="text-lg p-1 rounded-lg bg-green-200 font-bold w-max">$ {item.price}</p>
        <div className="details flex gap-2 text-sm">
          <div className="flex items-center gap-2 bg-gray-100 p-1">
            <FaBed />
            <span className="flex items-center gap-1">
              <span>{item.bedroom}</span> bedroom
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1">
            <FaBath />
            <span className="flex items-center gap-1">
              <span>{item.bathroom}</span> bathroom
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="functions flex flex-row md:flex-col gap-2 justify-center">
        {!profileList && (
          <div
            onClick={handleSave}
            onMouseEnter={() => setSaveHovered(true)}
            onMouseLeave={() => setSaveHovered(false)}
            className="cursor-pointer"
          >
            {isSaved ? (
              <>
                <CiBookmarkCheck id={`save-ed-${item.id}`} className="size-6 border shadow-md items-center flex justify-center hover:bg-gray-300 rounded-md" />
                <Tooltip
                  anchorSelect={`#save-ed-${item.id}`}
                  place="top"
                  className="bg-black text-white rounded-md"
                >
                  {isSaving ? "Unsaving..." : "Remove Bookmark"}
                </Tooltip>
              </>
            ) : (
              <>
                <CiBookmark id={`save-${item.id}`} className="size-6 border shadow-md items-center flex justify-center hover:bg-gray-300 rounded-md" />
                <Tooltip
                  anchorSelect={`#save-${item.id}`}
                  place="top"
                  className="bg-black text-white rounded-md"
                >
                  {isSaving ? "Saving..." : "Bookmark"}
                </Tooltip>
              </>
            )}
          </div>
        )}

        {(user?.id === item.userID || user?.role === "ADMIN") && (
          <>
            <MdOutlineDeleteForever
              id={`delete-${item.id}-${profileList}`}
              className="size-6 cursor-pointer border shadow-md items-center flex justify-center hover:bg-red-300 rounded-md"
              onClick={handleDelete}
            />
            <Tooltip
              anchorSelect={`#delete-${item.id}-${profileList}`}
              place="top"
              className="bg-black text-white rounded-md"
            >
              Delete
            </Tooltip>
            <FaEdit 
              id={`edit-${item.id}-${profileList}`}
              className="size-6 cursor-pointer border shadow-md items-center flex justify-center hover:bg-gray-300 rounded-md" 
              onClick={handleEdit}
            />
            <Tooltip
              anchorSelect={`#edit-${item.id}-${profileList}`}
              place="top"
              className="bg-black text-white rounded-md"
            >
              Edit
            </Tooltip>
          </>
        )}

        <IoChatbubbleEllipsesOutline
          id={`chat-${item.id}`}
          className="size-6 cursor-pointer border shadow-md items-center flex justify-center hover:bg-gray-300 rounded-md"
          onClick={() => {
            if (!user) {
              toast.error("You need to be logged in to send messages!");
              return;
            }
            else if (user.id === item.userID) {
              toast.error("You can't send messages to yourself!");
              return;
            }
            else 
            setIsMessageDialogOpen(true);
          }}
        />
        <Tooltip
          anchorSelect={`#chat-${item.id}`}
          place="top"
          className="bg-black text-white rounded-md"
        >
          Chat
        </Tooltip>
        
        <Link to={`/${item.id}`} aria-label='Visit'>
        <FaExternalLinkAlt id={`visit-${item.id}`} className="size-7 cursor-pointer border shadow-md items-center flex justify-center hover:bg-gray-300 rounded-md" />
        <Tooltip
          anchorSelect={`#visit-${item.id}`}
          place="bottom"
          className="bg-black text-white rounded-md"
        >
          Visit
        </Tooltip>
        </Link>
        
      </div>
    </div>
    
    {/* Action buttons end */}

    {/* Full view of image */}
    <AnimatePresence>
      {isModalOpen && selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>

    <MessageDialog
      receiver={item.user}
      receiverId={item.userID}
      isOpen={isMessageDialogOpen}
      onClose={() => setIsMessageDialogOpen(false)}
    />
  </>
);
};

export default Card