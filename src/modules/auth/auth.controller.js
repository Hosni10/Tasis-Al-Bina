import { userModel } from "../../../database/models/user.model.js"
import { sendEmailService } from "../../services/sendEmailService.js"
import { emailTemplate } from "../../utilities/emailTemplate.js"
import { generateToken, verifyToken } from "../../utilities/tokenFunction.js"

export const signUp = async(req,res,next) => {
    const {
        username,
        email,
        password,
        phoneNumber,
        age,
        gender
    } = req.body

    const isEmailExisted = await userModel.findOne({email})

    if(isEmailExisted){
        return next(new Error('Email Is Already Exsist', { cause: 400 }))
    }

    const token = generateToken({
        payload:{
            email,
        },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN, 
        expiresIn: '1h',
     })

     const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm/${token}`
    
     const isEmailSent = sendEmailService({
        to:email,
        subject:'Confirmation Email',
         message: //`<a href=${confirmationLink}> Click here to confirm </a>`
         emailTemplate({
            link: confirmationLink,
            linkData: 'Click here to confirm',
            subject: 'Confirmation Email',
         })
         ,
    }) 
    if(!isEmailSent){
        return next(new Error("Email not send",{cause:400}))
    }
    
    const user = new userModel({
        username,
        email,
        password,
        age, 
        gender,
        phoneNumber,
    })
    const saveUser = await user.save()
    res.status(201).json({message:'User Added successfully', saveUser})
}

export const confirmEmail = async(req,res,next) => {
    const {token} = req.params

    const decode = verifyToken({
        token,
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
    })
    const user = await userModel.findOneAndUpdate(
        {email: decode?.email, isConfirmed:false},
        {isConfirmed: true},
        {new:true},
        )
        if(!user){
            return next(new Error("already confirmed",{cause:404}))
        }
            return next(new Error("confirmed done, now log in",{cause:404}))
}


import pkg from 'bcrypt'
export const login = async(req,res,next) => {
    const {email,password} = req.body


    const userExsist = await userModel.findOne({email})
    if(!userExsist){
        return res.status(400).json({message: "in correct email"})
    }

    
    const passwordExsist = pkg.compareSync(password,userExsist.password)
    if(!passwordExsist){
        return res.status(400).json({message: "in correct password"})
    }

    const token = generateToken({
        payload:{
            email,
            _id: userExsist._id,
            role: userExsist.role
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET, // ! process.env.SIGN_IN_TOKEN_SECRET
        expiresIn: '1h',
     })
     

     const userUpdated = await userModel.findOneAndUpdate(
        
        {email},
        
        {
            token,
            status: 'online'
        },
        {new: true},
     )
     res.status(200).json({message: 'Login Success', userUpdated})
}