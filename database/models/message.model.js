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
    subject:{
        type: String,
        required: true
    },
    messageContent:{
        type: String,
        required: true
    }

})

export const Message = mongoose.model("Message", messageSchema);