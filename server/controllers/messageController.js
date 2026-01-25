const { getReceiverSocketId, io } = require("../config/socket");
const Message = require("../models/messageModel");
const User = require("../models/userModel")
const cloudinary = require('cloudinary').v2

const getUserSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (err) {
        console.error("Error ", err)
        res.status(500).json({success: false, message: err.message})
    }
}

const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json({success: true, messages})
    } catch (err) {
        console.error("Error ", err)
        res.status(500).json({success: false, message: err.message})
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (!text && !image) {
            return res.status(400).json({ message: "Message cannot be empty" })
        }


        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (err) {
        console.log("Error ", err)
        res.status(500).json({success: false, message: err.message})
    }
}   


module.exports = {getUserSidebar, getMessages, sendMessage}