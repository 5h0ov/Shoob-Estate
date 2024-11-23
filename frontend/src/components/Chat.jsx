import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Rnd } from "react-rnd";
import { useStore } from '../store/store.js'
import apiRequest from '../utils/apiRequest.js'
import TimeAgo from 'react-timeago'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMinus } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'

const API_URL = import.meta.env.VITE_API_URL;

const Chat = ({resData, currUserId}) => {
  const [showChat, setShowChat] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chatData, setChatData] = useState({})
  const [isFetchingChat, setIsFetchingChat] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [textAreaMsg, setTextAreaMsg] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { user, socket, isConnectingSocket, decreaseNotifications } = useStore()
  const chatEndRef = useRef(null)
  const textareaRef = useRef(null);

  // console.log(resData);
  // console.log(currUserId);


  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 768)
    })
  }, [])
  
  

  // Add useEffect to trigger scroll on messages update:
  useEffect(() => {
    if (chatEndRef.current) {
      const chatContainer = chatEndRef.current.parentElement;
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatData?.messages]);

  const handleChatBox = async (id, receiver) => {
    setShowChat(true)
    setIsMinimized(false)
    setIsFetchingChat(true)

    // // Reset textarea if it exists
    // if (textareaRef.current) {
    //   textareaRef.current.value = '';
    //   setTextAreaMsg('');
    // }

    try {
      const res = await apiRequest.get(`${API_URL}/api/chat/${id}`)
      // console.log(res.data.chat)
      setChatData(res.data.chat)
      if(!res.data.chat.seenBy.includes(currUserId)) {
        decreaseNotifications()
      }
    } catch (error) {
      console.error(error)
    }
    finally {
      setIsFetchingChat(false)
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = (e.target.text?.value) || (e.target.value) || textAreaMsg;
  
    if (!text?.trim()) return;

    setIsSending(true)
    try {
      const res = await apiRequest.post(`${API_URL}/api/message/${chatData.id}`, {text})
      // console.log(res.data)
      // setChatData({...chatData, messages: [...chatData.messages, res.data.message]})

      console.log("receiverID: ", chatData.receivers[0].id)
      socket.emit('sendMessage', {
        receiverID: chatData.receivers[0].id,
        chatID: chatData.id,
        message: res.data.message,
      });
      
      resData.chats.forEach((chat) => {
        if (chat.id === chatData.id) {
          chat.recentMessage = text;
        }
      });

      // e.target.text.value = "" // reset
      if (e.target.text) {
        e.target.text.value = '';
      } else {
        e.target.value = '';
      }
      setTextAreaMsg('');
  
      console.log("updated chat data: ", chatData)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || "Error sending message")
    }
    finally {
      setIsSending(false);
    }
  }

  useEffect(() => {
    console.log("Setting up socket listener");
    console.log("Socket:", socket);
    console.log("ChatData:", chatData);
    console.log("IsConnectingSocket:", isConnectingSocket);

    const readChat = async () => {
      try {
        const res = await apiRequest.put(`${API_URL}/api/chat/read/${chatData.id}`)
        console.log("read:", res.data)
      } catch (error) {
        console.error(error)
      }
    }

  
    if (socket && chatData && !isConnectingSocket) {
      console.log("Adding getMessage listener");
      
      socket.on('getMessage', (data) => {
        console.log('Received getMessage event:', data);
        const { message, chatID, senderID } = data;
        
        console.log('Current chatData.id:', chatData.id);
        console.log('Received chatID:', chatID);
        
        if (chatData.id === chatID) {
          console.log('Updating chat with new message');
          setChatData(prev => ({
            ...prev,
            messages: [...prev.messages, message],
          }));

          resData.chats.forEach((chat) => {
            if (chat.id === chatID) {
              chat.recentMessage = message.text;
            }
          });

          readChat();
        }
      });
    }
  

  }, [socket, chatData?.id, isConnectingSocket]);

  return (
    <>
      <motion.div className='messages flex flex-col gap-4 overflow-y-auto flex-1'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      >

        {(resData?.chats).map((chat) => (
          <motion.div className={`msg ${chat.seenBy.includes(currUserId) || chat.id == chatData.id ? 'bg-white' : 'bg-yellow-100/70'} p-4 rounded-md flex items-center gap-5 cursor-pointer transition-colors duration-500 ease-in-out shadow-md hover:bg-slate-100`} 
          key={chat.id} 
          onClick={()=>handleChatBox(chat.id, chat.receivers[0])}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, duration: 0.2 }}
          >
            <img src={chat.receivers[0].avatar || "./blank_avatar.png"} alt="" className='w-12 h-12 rounded-full object-cover'/>
            <motion.div className='flex flex-col'
            >
              <span className='font-bold'>{chat.receivers[0].username}</span>
              {chat.receivers[0].role? (
                <span className='text-sm text-gray-500 capitalize'>
                  {chat.receivers[0].role.toLowerCase()}
                </span>
              ) : (
                <span className='text-sm text-gray-500'>
                  Unknown
                </span>
              )
            }
            </motion.div>
            <p> 
              {chat.recentMessage || "No messages yet."}
            </p>
          </motion.div>  
        ))}
        
      </motion.div>

      {/* ChatBox Modal */}
      <AnimatePresence>
        
        {showChat && (
          isMobile ? (
            <motion.div
            className={`chat-menu fixed bottom-0 right-4  bg-white rounded-t-lg shadow-lg flex flex-col ${
              isMinimized ? 'h-12' : 'h-96'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >

            <div className="flex items-center justify-between p-2 bg-yellow-200 rounded-t-lg">
              <div className="flex items-center gap-2">
                {!isFetchingChat?<> 
                <img
                  src={chatData.receivers?.[0]?.avatar || './blank_avatar.png'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">
                    {chatData.receivers?.[0]?.username || 'Loading...'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {chatData.receivers?.[0]?.role?.toLowerCase() || 'User'}
                  </p>
                </div>
                
              </> : <div className="flex flex-row gap-2 justify-center items-center ">
              <span className="chat-loader invert" />
              <div className="shimmer h-6 w-32"></div>
            </div> }
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiMinus />
                </button>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <IoClose />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 p-2 overflow-y-auto">
                  {isFetchingChat ? (
                    <div className="flex justify-center items-center h-screen">
                    <span className="chat-loader invert" />
                  </div>
                  ) : (
                    chatData.messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          currUserId === msg.userID
                            ? 'text-right self-end'
                            : 'text-left'
                        }`}
                      >
                        <p
                          className={`inline-block p-2 rounded-lg ${
                            currUserId === msg.userID
                              ? 'bg-yellow-100 text-gray-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {msg.text}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          <TimeAgo date={msg.createdAt} />
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSubmit}
                  className="p-2 border-t flex items-center space-x-2"
                >
                  <textarea
                    ref={textareaRef}
                    className="flex-1 p-2 border rounded-md resize-none focus:outline-none"
                    placeholder="Type your message..."
                    rows={1}
                    value={textAreaMsg}
                    onChange={(e) => setTextAreaMsg(e.target.value)}
                    disabled={isSending || isConnectingSocket}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSending || isConnectingSocket}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-md disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </motion.div>
          ) : (
          <Rnd
          minWidth={!isMinimized ? 400 : 300}
          minHeight={!isMinimized ? 500 : 50}
          bounds="window"
          enableResizing={
            isMinimized
              ? false // Completely disable resizing
              : {
                  bottomRight: true,
                  bottomLeft: true,
                  topRight: true,
                  topLeft: true,
                  bottom: true,
                  top: true,
                  left: true,
                  right: true,
                }
          }
          dragHandleClassName="chat-header" // Draggable only via header
          className="z-50 hidden md:block" // Ensure the component is above other elements
        >
          <motion.div
            className={`chat-menu fixed w-full h-full bg-white rounded-t-lg shadow-lg flex flex-col  ${
              isMinimized ? 'h-16' : ''
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ width: "100%", height: "100%" }}
          >
            <div className="chat-header flex items-center justify-between p-2 bg-yellow-200 rounded-t-lg active:bg-yellow-300">
              <div className="flex items-center gap-2">
                {!isFetchingChat?<> 
                <img
                  src={chatData.receivers?.[0]?.avatar || './blank_avatar.png'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">
                    {chatData.receivers?.[0]?.username || 'Loading...'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {chatData.receivers?.[0]?.role?.toLowerCase() || 'User'}
                  </p>
                </div>
                
              </> : <div className="flex flex-row gap-2 justify-center items-center ">
              <span className="chat-loader invert" />
              <div className="shimmer h-6 w-32"></div>
            </div> }
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMinimized(!isMinimized)}}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiMinus className='size-6'/>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowChat(false)}}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <IoClose className='size-6'/>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto">
                  {isFetchingChat ? (
                    <div className="flex justify-center items-center h-1/2">
                    <span className="chat-loader invert" />
                  </div>
                  ) : (
                    chatData.messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          currUserId === msg.userID
                            ? 'text-right self-end'
                            : 'text-left'
                        }`}
                      >
                        <p
                          className={`inline-block p-2 rounded-lg ${
                            currUserId === msg.userID
                              ? 'bg-yellow-100 text-gray-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {msg.text}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          <TimeAgo date={msg.createdAt} />
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSubmit}
                  className="p-2 border-t flex items-center space-x-2"
                >
                  <textarea
                    ref={textareaRef}
                    className="flex-1 p-2 border rounded-md resize-none focus:outline-black"
                    placeholder="Type your message..."
                    rows={1}
                    disabled={isSending || isConnectingSocket}
                    required
                    value={textAreaMsg}
                    onChange={(e) => setTextAreaMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSending || isConnectingSocket}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md disabled:opacity-50 font-semibold"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </motion.div>
          </Rnd>
          )
        )}
      </AnimatePresence>
    </>
  )
}  
 
export default Chat