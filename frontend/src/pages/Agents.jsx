// frontend/src/pages/Agents.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaStar } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import apiRequest from '../utils/apiRequest.js';
import { useStore } from '../store/store.js';
import MessageDialog from '../components/MessageDialog.jsx';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const Agents = () => {
  const { user } = useStore();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`${API_URL}/api/auth/getAgents`);
        setAgents(res.data.agents);
        // console.log(res.data.agents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setLoading(false);
      }
    }
    fetchAgents();
  }
  ,[]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loader-1" />
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-start h-full bg-[#fcf5f3] text-gray-800 p-6 overflow-y-auto">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-2">Our Agents</h1>
        <p className="text-lg max-w-2xl">
          Meet our experienced team of property experts who are here to help you find your perfect home.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {agents.map((agent) => ( <React.Fragment key={agent.id}>
          <motion.div
            key={agent.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-64"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="relative">
              <img
                src={agent.avatar || "./blank_avatar.png"}
                alt={agent.username}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full flex items-center gap-1">
                <FaStar className="text-yellow-800" />
                <span className="font-bold">{agent.rating}</span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{agent.username}{agent.id === user.id && <>&nbsp;(You)</>}</h2>
              <p className="text-yellow-800 font-semibold mb-4">{agent.role}</p>
              
              <div className="flex flex-col gap-3 mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">Experience:</span> {agent.experience}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Properties:</span> {agent.properties}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Specialization:</span> {agent.specialization}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <motion.a
                  href={`tel:${agent.phone || "+91 XXXXXXXXXX"}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-800"
                  whileHover={{x: 5}}
                >
                  <FaPhoneAlt />
                  <span>{agent.phone || "+91 XXXXXXXXXX"}</span>
                </motion.a>
                <motion.a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-800"
                  whileHover={{x: 5}}
                >
                  <FaEnvelope />
                  <span>{agent.email}</span>
                </motion.a>
              </div>

              <motion.button
                className="w-full mt-6 bg-yellow-400 text-black font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2"
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                onClick={() => {
                  if (!user) {
                    toast.error("You need to be logged in to send messages!");
                    return;
                  }
                  else if(user.id === agent.id) {
                    toast.error("You can't send messages to yourself!");
                    return;
                  }
                  setIsMessageDialogOpen(true);
                }}
              >
                <IoChatbubbleEllipsesOutline className="text-xl" />
                Contact Agent
              </motion.button>
            </div>

          </motion.div>

          <MessageDialog 
            receiver={agent}
            receiverId={agent.id}
            isOpen={isMessageDialogOpen}
            onClose={() => setIsMessageDialogOpen(false)}
          />
        </React.Fragment>
        ))}
      </motion.div>



    </div>
  );
};

export default Agents;