import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/store.js';
import apiRequest from '../utils/apiRequest.js';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

const MessageDialog = ({ receiver, receiverId, isOpen, onClose }) => {
  const [isSending, setIsSending] = useState(false);
  const { user, socket, initializeSocket, isConnectingSocket } = useStore();
  const [alreadyConnected, setAlreadyConnected] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      if(socket.connected) {
        setAlreadyConnected(true);
        return
      }
      console.log('Initializing socket');
      initializeSocket();
      console.log('Socket initialized');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(user.id === receiverId) {
        toast.error("You can't send message to yourself");
    }
    const text = textareaRef.current.value.trim();
    
    if (!text) return;

    setIsSending(true);
    try {
      // First create a new chat
        try {
            const chatRes = await apiRequest.post(`${API_URL}/api/chat`, {
                userID2: receiverId
              });

            console.log('Chat created:', chatRes.data.chat);
            const chatID = chatRes.data.chat.id;
            const msgRes = await apiRequest.post(`${API_URL}/api/message/${chatID}`, {
                text
            });
            
            console.log('Message sent:', msgRes.data.message);
            if (socket) {
                socket.emit('sendMessage', {
                receiverID: receiverId,
                chatID: chatID,
                message: msgRes.data.message.text,
                });
            }
            toast.success('Message sent successfully, Go to Profile to continue chatting!');
            textareaRef.current.value = '';
            
        }
        catch (error) {      
        if(error.response?.data?.message === "Chat already exists") {
            // Then send the message
            console.log('Chat already exists');
            console.log("Existing Chat: ",error.response?.data?.existingChat);
            const existingChat = error.response?.data?.existingChat;
            const msgRes = await apiRequest.post(`${API_URL}/api/message/${existingChat.id}`, {
                text
            });

            console.log('Message sent:', msgRes.data.message);

            if (socket) {
                socket.emit('sendMessage', {
                receiverID: receiverId,
                chatID: existingChat.id,
                message: msgRes.data.message.text,
                });
            }

            toast.success('Message sent successfully, Go to Profile to continue chatting!');
            textareaRef.current.value = '';
        }
        else {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send message');
            return;
        }
    }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const closeAndDisconnect = () => {
    if (socket && !alreadyConnected) {
      console.log('Disconnecting socket');
      socket.disconnect();
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Message to {receiver.username}</h2>
          <button 
            aria-label='Close Dialog'
            onClick={closeAndDisconnect}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose className="size-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            ref={textareaRef}
            className="w-full h-32 p-2 border border-gray-300 rounded resize-none"
            placeholder="Type your message..."
            disabled={isSending && isConnectingSocket}
          />
          <div className="flex justify-end">
            <button
              aria-label='Send Message'
              type="submit"
              disabled={isSending && isConnectingSocket}
              className={`px-4 py-2 bg-yellow-400 rounded-md hover:bg-yellow-500 
                ${isSending || isConnectingSocket ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageDialog;