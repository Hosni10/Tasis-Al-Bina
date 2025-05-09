import { model, Schema } from "mongoose"

const tempVerificationSchema = new Schema({
    email:{
        type:String,
        // required:true,
    },
    code:{
        type:Number,
        // required:true,
    },
    codeExpiresAt: Date

},{timestamps:true})

export const tempVerificationModel = model('tempVerification', tempVerificationSchema)