import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderName:{
        type: String,
        required: true
    },
    senderEmail:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    messageContent:{
        type: String,
        required: true
    }

},{timestamps:true})

export const Message = mongoose.model("Message", messageSchema);