import { create } from "zustand" 
import { api } from "../api/api"

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
    } 
}))