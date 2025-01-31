import { Message } from "../../../database/models/message.model.js"
import { pagination } from "../../utilities/pagination.js"



export const createMessage = async(req,res,next) => {
    const {
        senderName,
        senderEmail,
        phone,
        messageContent
    } = req.body

    const messageObject = {
        senderName,
        senderEmail,
        phone,
        messageContent
    }

    const messageData = await Message.create(messageObject)

    if(!messageData) return next(new Error("message didn't sent",{cause:403}))

    res.status(201).json({message:"sent sucessfully",messageData})
}

export const getAllMessages = async(req,res,next) => {
    try {
    const {page, size} = req.query
    const {limit, skip} = pagination({page, size}) 

    const messages = await Message.find().limit(limit).skip(skip)

    if(!messages) return next(new Error("No messages found",{cause:404}))

    res.status(201).json({message:"Messages", messages})
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const getSingleMessage = async(req,res,next) => {

    const id = req.params.id 
    const message = await Message.findById(id)
    if(!message) return next(new Error("No message found",{cause:404}))
    res.status(201).json({message:"Messages", message})
}

export const deleteMessage = async(req,res,next) => {
    const id = req.params.id 
    const message = await Message.findByIdAndDelete(id)
    if(!message) return next(new Error("No message found",{cause:404}))
    res.status(201).json({message:"Message deleted sucessfully", message})
}