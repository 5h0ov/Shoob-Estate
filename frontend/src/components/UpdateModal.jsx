// Modal.jsx
import React, { useState, useRef } from "react";
import { useStore } from "../store/store.js";
import { toast } from "react-toastify";
import { AiFillCamera } from "react-icons/ai";
import { motion } from "framer-motion";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const UpdateModal = ({ onClose, user }) => {
  if (!user) return toast.error("User not authenticated!");
  const { isUpdatingAvatar, updateUser, isEdittingUser } = useStore();
  const inputFile = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [avatar, setAvatar] = useState(user.avatar || "./blank_avatar.png");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the parent component's updateProfile function
    const formData = new FormData(e.target); 

    updateUser({ username, email, password, role });
    
    onClose(); // Close the modal after submitting
  };

  const handleAvatarChange = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const toastId = toast.loading("Uploading...", { autoClose: false });

    try {
      // get file
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("avatar", file);
      // upload to cloudinary
      const res = await axios.post(`${API_URL}/api/auth/updateAvatar`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('jwt-shoobestate')}`
        },
        // onUploadProgress: (x) => {
        //   if (x.total < 1024000)
        //     return toast.info("Uploading");
        // },
      });
      setIsUploading(false);
      // console.log(res);
      toast.dismiss(toastId); 
      toast.success(res.data.msg);
  
      user.avatar = res.data.url;
      setAvatar(res.data.url);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response.data.msg)
      setIsUploading(false);
    }
  };

  const handleAvatarInput = () => {
    inputFile.current.click();
  };

  return (
    <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
      initial={{ opacity: 0, y: 10, scaleX: 0.2 }}
      animate={{ opacity: 1, y: 0, scaleX: 1 }}
      exit={{ opacity: 0, y: 10, scaleX: 0.2 }}
      transition={{ duration: 0.25 }}
      >
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="avatar flex justify-center items-center relative" onClick={handleAvatarInput}>

            <div className="flex relative">
            {isUploading ? (
              <span className="loader-avatar invert"></span>
              ) : (<>
                <img src={avatar} alt="User Picture" className="w-20 h-20 rounded-full object-cover" /> 
                <AiFillCamera className="absolute inset-0 m-auto opacity-0 h-16 w-16 transition-all duration-75 ease-in-out hover:opacity-90 hover:bg-gray-50/70 hover:p-1 rounded-full hover:cursor-pointer" />
              </>
            )}

            {/* </>
          )} */}
            </div>
            </div>
            <input
              type="file"
              name="avatar"
              ref={inputFile}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />

          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="border border-gray-300 rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password" 
              type="password"
              disabled={true}
              className={`border border-gray-300 rounded p-2`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="role" className="font-semibold">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Select Role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEdittingUser || isUploading || isUpdatingAvatar}
              className="py-2 px-4 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateModal;
