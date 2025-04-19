import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: {
        userId: authUser._id,
      },
      //transports: ["websocket"],
    });
    socket.connect();

    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      //console.log("online users", userIds);
      set({ onlineUsers: userIds });
    });

    
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket();

    } catch (error) {
      console.log("erroe in check auth", error);
      set({ authUser: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();

    } catch (error) {
      // toast.error(error.response.data.message);
      // console.log("error in signup",error);
      toast.error(error?.response?.data?.message || "Login failed");
      console.log("error in login", error);
    }
    finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      console.log(res.data);
      toast.success("Logged in successfully");

      get().connectSocket();

    } catch (error) {
      // toast.error(error.response.data.message);
      // console.log("error in signup",error);
      toast.error(error?.response?.data?.message || "Login failed");
      console.log("error in login", error);
    }
    finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      
      get().disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.log("error in login", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error in update profile", error);
    }
    finally {
      set({ isUpdatingProfile: false });
    }
  },

  
}));