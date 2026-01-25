import { create } from "zustand";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await api.get("/api/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) return;
    if (socket) socket.disconnect();

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
        const filteredIds = userIds.filter(id => id !== authUser._id);
        set({ onlineUsers: filteredIds });
    });


    newSocket.on("disconnect", () => {
      set({ onlineUsers: [] });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.off("getOnlineUsers");
      socket.disconnect();
    }

    set({ socket: null, onlineUsers: [] });
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/api/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await api.post("/api/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in Successfully");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/api/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
