const Message = require("../models/messageModel");
const User = require("../models/userModel")

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

        res.status(201).json(newMessage)

    } catch (err) {
        console.log("Error ", err)
        res.status(500).json({success: false, message: err.message})
    }
}   


module.exports = {getUserSidebar, getMessages, sendMessage}