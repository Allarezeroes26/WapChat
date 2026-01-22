import { create } from "zustand" 
import { api } from "../api/api"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth : async () => {
        try {
            const res = await api.get("/api/auth/check");
            set({authUser: res.data})
        } catch (err) {
            console.error(err.message)
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signUp : async (data) => {
        set({isSigningUp: true})
        try {
            const res = await api.post('/api/auth/signup', data)
            set({authUser: res.data})
            toast.success("Account created successfully!")
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({isSigningUp: false})
        }
    },

    login: async (data) => {
        set({isLoggingIng: true})
        try {
            const res = await api.post('/api/auth/login', data);
            set({authUser: res.data})
            toast.success("Logged in Successfully");
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({isLoggingIng: false})
        }
    },


    logout: async () => {
        try {
            await api.post('/api/auth/logout')
            set({authUser: null})
            toast.success("Logged out Successfully")
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }
}))