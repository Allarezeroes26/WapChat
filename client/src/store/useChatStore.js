import { create } from 'zustand'
import toast from 'react-hot-toast'
import { api } from '../api/api'

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });

        try {
            const res = await api.get('/api/messages/users')
            set({users: res.data})
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await api.get(`/api/messages/${userId}`)
            set({ messages: res.data })
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser})
}))