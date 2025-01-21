import { Schema,model } from "mongoose"
import pkg from 'bcrypt'
import { systemRoles } from "../../src/utilities/systemRole.js"

const userSchema = new Schema({

    username:{
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
    isConfirmed:{
        type:Boolean,
        required:true,
        default:false,
    },
    role:{
        type:String,
        default:'SuperAdmin',
        enum:[systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
    },
    age:{Number},
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
    token:String,
    forgetCode:String,
},{timestamps:true})

    userSchema.pre('save',function(){
        this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
    })

export const userModel = model('User', userSchema)

