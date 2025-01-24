import { model, Schema } from "mongoose";

const reviewsSchema = new Schema({
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
    name:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required: true
    },
    rate:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    customId: String,

},{timestamps:true})

export const reviewsModel = model("Reviews",reviewsSchema)