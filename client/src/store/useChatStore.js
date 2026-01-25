import { create } from 'zustand'
import toast from 'react-hot-toast'
import { api } from '../api/api'
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
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
            set({ messages: res.data.messages })
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()

        if (!selectedUser) {
            toast.error("No user selected")
            return
        }

        try {
            const res = await api.post(
            `/api/messages/send/${selectedUser._id}`,
            messageData
            )

            set({ messages: [...messages, res.data] })
        } catch (err) {
            console.error("Send message error:", err)
            toast.error(err.response?.data?.message || "Failed to send message")
        }
    },

    focusMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage")

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({messages: [...get().messages, newMessage]})
        })
    },

    unFocusMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({selectedUser})
}))