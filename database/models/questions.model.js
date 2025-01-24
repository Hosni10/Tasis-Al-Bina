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
    description:{                                       // ! meta tag description
        type:String,
        required:true,
    },
    Keywords:{                                         // ! الكلمات المفتاحية
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
},{timestamps:true})

export const questionsModel = model("questions",questionsSchema)