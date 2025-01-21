import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    Image: {
        secure_url:{
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    content: {
        type: String,
        required: true
    },
    customId:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

export const Blog = mongoose.model("Blog", blogSchema);


// wxdhqehya