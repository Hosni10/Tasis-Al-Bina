import { Schema,model } from "mongoose"
import { systemRoles } from "../../src/utilities/systemRole.js"

const userSchema = new Schema({

    firstName:{
        type:String,
        required: true,
    },

    middleName:{
        type:String,
        required: true,
    },

    lastName:{
        type:String,
        required: true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        required:true,
        enum:[systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
    },

     phoneNumber:{
        type:String,
    },

    profilePicture:{
        secure_url:String,
        public_id:String,
    },

    status:{
        type:String,
        default:'offline',
        enum:['offline','online'],
    },
    verificationCode: Number,
    codeExpiresAt: Date,

    token:String,
    forgetCode:String,
},{timestamps:true})


export const userModel = model('User', userSchema)

