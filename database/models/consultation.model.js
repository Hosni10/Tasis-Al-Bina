import { model, Schema } from "mongoose";

const consultationSchema = new Schema({
    type:{
        type:String,
        required:true,
        enum:["google_meet","phone_call","whatsapp","zoom"]
    },
    selectedDay:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"قيد الانتظار",
        enum:["قيد الانتظار","مكتملة","ملغية"]
    },
    isRead: {
        type: Boolean,
        default: false
      },
},{timestamps:true})

export const consultationModel = model("consultation",consultationSchema)