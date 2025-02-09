import { model, Schema } from "mongoose";

const questionsSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required: true
    },
    lang:{                                       
        type:String,
        required:true,
        default:"ar",
        enum:["ar","en"]
    },
    // createdBy:{
    //     type:Schema.Types.ObjectId,
    //     ref:"User",
    //     // required:true
    // },
},{timestamps:true})

export const questionsModel = model("questions",questionsSchema)