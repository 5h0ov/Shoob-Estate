import { create } from "zustand";
import { toast } from "react-toastify";
import apiRequest from "../utils/apiRequest.js";
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
import io from "socket.io-client";


export const useStore = create((set, get) => ({
  // can use this hook to create a global state
  // set is a function that takes an object and updates the state with the object in zustand
  user: null,
  isSigningUp: false,
  checkingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  isUpdatingAvatar: false,
  isEdittingUser: false,
  socket: null,
  isConnectingSocket: false,
  notifications: 0,
  fetchingNotifications: false,

  initializeSocket: () => {
    const { user } = get();
    if (user && !get().socket) {
      const state = get();

      set({ isConnectingSocket: true });
      try {
        const socket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: true,
          auth: { userID: user.id } // Add user authentication
        });
  
        socket.on('connect', () => {
          console.log('Socket connected with ID:', socket.id);
          set({ socket, isConnectingSocket: false });
          socket.emit("newUser", user.id);
        });
  
        socket.on('disconnect', () => {
          console.log(socket)
          set({ socket, isConnectingSocket: false });
          console.log('Socket disconnected');
        });

        set({ socket, isConnectingSocket: false });
      } catch (error) {
        console.error('Socket initialization error:', error);
        set({ socket, isConnectingSocket: false });
      }
    }
  },
  // Add notification actions
  fetchNotifications: async () => {
    set({ fetchingNotifications: true });
    try {
      const res = await apiRequest.get(`${API_URL}/api/auth/notifications`);
      console.log("Notifications: ", res.data)
      set({ notifications: res.data.number, fetchingNotifications: false });
    } catch (error) {
      console.error(error);
    }
  },

  decreaseNotifications: () => {
    set((state) => ({ 
      notifications: Math.max(0, state.notifications - 1) 
    }));
  },

  resetNotifications: () => {
    set({ notifications: 0 });
  },
  
  signup: async (credentials) => {
    set({ isSigningUp: true }); // set isSigningUp to true when signing up
    try {
      const res = await apiRequest.post(`${API_URL}/api/auth/signup`, credentials);
      localStorage.setItem('jwt-shoobestate', res.data.token);
      // console.log(res.data)
      localStorage.setItem(`user`, JSON.stringify(res.data.user));
      
      set({ user: res.data.user, isSigningUp: true }); // set our state after signing up. This will trigger a re-render and .data.user as the response has the user object AND a success object
      toast.success("Signup successful!"); // show a toast message
      return { success: true }; // return a success object
    } catch (error) {
      // toast.error(error.response.data.message || "Error in Signing up"); // if there is an error, show the error message
      set({ isSigningUp: false, user: null }); // set isSigningUp back to false
      return { success: false, message: error.response.data.message }; // return a failure object
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await apiRequest.post(`${API_URL}/api/auth/login`, credentials);
      localStorage.setItem('jwt-shoobestate', res.data.token);
      // console.log(res.data.user.avatar)
      localStorage.setItem(`user`, JSON.stringify(res.data.user));

      set({ user: res.data.user, isLoggingIn: false });
      toast.success("Logged in successfully");
      console.log(res.data.user)
      return { success: true }; // return a success object

    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in logging in");
      set({ user: null, isLoggingIn: false });
      return { success: false, message: error.response.data.message }; // return a failure object

    }
  },
  updateAvatar: async (avatar) => {
    set({ isUpdatingAvatar: true });
    try {
      // console.log("avatar:" ,avatar)
      const res = await apiRequest.put(`${API_URL}/api/auth/updateAvatar`, avatar);
      set({ user: res.data.user, isUpdatingAvatar: false });
      toast.success("Avatar updated successfully");
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in updating avatar");
      set({ isUpdatingAvatar: false });
    }
  },
  updateUser: async (credentials) => {
    set({ isEdittingUser: true });
    try {
      const res = await apiRequest.put(`${API_URL}/api/auth/editUser`, credentials);
      set({ user: res.data.user, isEdittingUser: false });
      toast.success("User updated successfully");
      return { success: true };
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message || "Error in updating user");
      set({ isEdittingUser: false });
      return { success: false, message: error.response.data.message };
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await apiRequest.post(`${API_URL}/api/auth/logout`);  
      if(!localStorage.getItem(`user`))
      {
        toast.error("No user logged in!");
        return;
      }
      else{
        localStorage.removeItem('user');
        localStorage.removeItem('jwt-shoobestate');

        if(get().socket) {
          get().socket.disconnect();
          set({ socket: null });
        }
        set({ user: null, isLoggingOut: false });
        toast.success("Logged out successfully");
      }

    } catch (error) {
      // console.log(error)
      toast.error(error.message || "Error in logging out");
      set({ isLoggingOut: false });
    }
  },
  getAuth: async () => {
    set({ checkingAuth: true });
    try {
      const token = localStorage.getItem('jwt-shoobestate');
      const toastId = toast.loading("Authenticating...", { autoClose: false });
      
      const res = await apiRequest.get(`${API_URL}/api/auth/getAuth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.dismiss(toastId); 
      toast.success(res.data.msg);

      localStorage.setItem(`user`, JSON.stringify(res.data.user));
      
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      console.log(error)
      set({ user: null, checkingAuth: false });
    }
  },
})); // now we can use the functions in the store in any component in our app
