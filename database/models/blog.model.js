import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
      },
      description: {
        type:String,
        required:true
      },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    Keywords: [{ type: String, required: true }], 
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
    lang:{
        type:String,
        required:true,
        default:"ar",
        enum:["ar","en"]
    },
    views:{
        type:Number,
        default:253,
        required:true
    },
    customId:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

export const Blog = mongoose.model("Blog", blogSchema);