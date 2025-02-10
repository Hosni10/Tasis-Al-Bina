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
    lang:{
        type:String,
        required:true,
        default:"ar",
        enum:["ar","en"]
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
        enum: [1.0, 2.0, 3.0, 4.0, 5.0]
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    customId: String,

},{timestamps:true})

export const reviewsModel = model("Reviews",reviewsSchema)