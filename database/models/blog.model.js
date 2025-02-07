import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: {
        en: { type: String, required: true },
        ar: { type: String, required: true },
    },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true },
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Keywords: {
        en:[{ type: String, required: true }],
        ar:[{ type: String, required: true }]
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
    views:{
        type:Number,
        default:253,
        required:true
    },
    customId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema);
