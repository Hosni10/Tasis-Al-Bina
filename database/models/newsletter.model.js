import { model, Schema } from "mongoose";

const newsletterScheme = new Schema({
    email:{
        type:String,
        required:true
    }
},{timestamps:true})


export const newsletterModel = model("Newsletter",newsletterScheme)