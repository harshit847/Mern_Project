const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://mern-project-pj2y-git-main-harshit-rais-projects-524f8638.vercel.app"], // ✅ Allow WebSocket connections
        methods: ["GET", "POST"],
        credentials: true,
    }
});


const onlineUser = new Set()

io.on('connection', async (socket) => {
    console.log("✅ User Connected:", socket.id)

    const token = socket.handshake.auth.token
    const user = await getUserDetailsFromToken(token)

    if (!user) {
        console.log("❌ Invalid token, disconnecting:", socket.id)
        socket.disconnect()
        return
    }

    socket.join(user._id.toString())
    onlineUser.add(user._id.toString())

    io.emit('onlineUser', Array.from(onlineUser))

    socket.on('message-page', async (userId) => {
        //console.log('📩 Fetching message page for user:', userId)

        const userDetails = await UserModel.findById(userId).select("-password")
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }
        socket.emit('message-user', payload)

        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

        console.log("📜 Previous Messages Fetched:", getConversationMessage?.messages?.length || 0)
        socket.emit('message', getConversationMessage?.messages || [])
    })

    socket.on("new message", async (data) => {
        console.log("📥 New Message Received:", data)

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })

        if (!conversation) {
        //    console.log("🆕 Creating new conversation between:", data?.sender, "and", data?.receiver)
            const createConversation = new ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save()
        }

        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
            createdAt: new Date()
        })

        const saveMessage = await message.save()
        await ConversationModel.updateOne(
            { _id: conversation?._id },
            { "$push": { messages: saveMessage?._id } }
        )

        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

       // console.log("📤 Sending Updated Messages to Users:", data?.sender, data?.receiver)
        io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
        io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)

        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
    })

    socket.on('sidebar', async (currentUserId) => {
        console.log("📂 Fetching sidebar data for user:", currentUserId)

        const conversation = await getConversation(currentUserId)
        socket.emit('conversation', conversation)
    })

    socket.on('seen', async (msgByUserId) => {
        console.log("👀 Marking messages as seen for user:", msgByUserId)

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        })

        const conversationMessageId = conversation?.messages || []
        await MessageModel.updateMany(
            { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
            { "$set": { seen: true } }
        )

        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id?.toString()).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReceiver)
    })

    socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString())
        console.log('❌ User Disconnected:', socket.id)
    })
})

module.exports = {
    app,
    server
}
