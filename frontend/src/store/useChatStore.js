import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { Socket } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {

    console.log("🔍 getMessages called with userId:", userId);
    if (!userId) {
      console.warn("⛔ Invalid userId passed to getMessages");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log("Messages:", res.data);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

subscribeToMessages: () => {
    const { selectedUser } = get();
    if(!selectedUser) {
      //console.warn("⛔ No selected user to subscribe to messages for.");
      return;
    }
    const socket  = useAuthStore.getState().socket;
    socket.on("newMesaaages", (newMessage) => {
      
      set({ messages: [...messages, newMessage] });
    });
  },

unsubscribeFromMessages: () => {
    const socket  = useAuthStore.getState().socket;
    socket.off("newMessages");
},

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },
}));