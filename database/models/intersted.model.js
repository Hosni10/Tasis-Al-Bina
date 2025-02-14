import { model, Schema } from "mongoose";


const interstedSchema = new Schema({
    fullName:{
        type:String,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    isRead: {
        type: Boolean,
        default: false
      },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required:true
    },
    unitId:{
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required:true,
    },

},{timestamps:true})

export const interstedModel = model("intersted",interstedSchema)