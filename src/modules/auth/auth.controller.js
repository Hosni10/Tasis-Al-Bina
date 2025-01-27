import { userModel } from "../../../database/models/user.model.js"
import { generateToken, verifyToken } from "../../utilities/tokenFunction.js"
import crypto from 'crypto';
import {sendVerificationEmail} from "../../services/sendEmailService.js"
// export const signUp = async(req,res,next) => { 
//     const {
//         firstName,
//         middleName,
//         lastName,
//         email,
//         password,
//         phoneNumber,
//         role
//     } = req.body

//     const isEmailExisted = await userModel.findOne({email})

//     if(isEmailExisted){
//         return next(new Error('Email Is Already Exsist', { cause: 400 }))
//     }

//     const token = generateToken({
//         payload:{
//             email,
//         },
//         signature: process.env.CONFIRMATION_EMAIL_TOKEN, 
//         expiresIn: '1h',
//      })
     
//     const user = new userModel({
//         firstName,
//         middleName,
//         lastName,
//         email,
//         password,
//         phoneNumber,
//         role
//     })
//     const saveUser = await user.save()
//     res.status(201).json({message:'User Added successfully', saveUser})
// }  // ! for admin crate one account and will delete that api 


const verificationCodes = new Map(); // Key: email, Value: { code, expiresAt }

export const sendEmailBinCode = async (req, res, next) => {
    const { email } = req.body;
    
   const verificationCode = crypto.randomInt(100000, 999999);

   verificationCodes.set(email, {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  console.log(verificationCodes);


   try {
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

export const addUser = async (req, res, next) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
        verificationCode,  
      } = req.body;
  
      const EmailExisted = await userModel.findOne({ email: email });
      if (EmailExisted) return next(new Error('This email is already exist'));
  
   const storedCode = verificationCodes.get(email);
   console.log(storedCode);
   
   if (!storedCode) {
     console.error('No verification code found for email:', email);
     return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
   }
 
   if (storedCode.code !== parseInt(verificationCode)) {
     console.error('Verification code mismatch:', { stored: storedCode.code, provided: verificationCode });
     return res.status(400).json({ error: 'Invalid or expired verification code' });
   }
 
    if (storedCode.expiresAt < Date.now()) {
     console.error('Verification code expired for email:', email);
     return res.status(400).json({ error: 'Verification code expired' });
   }
       const user = new userModel({
        firstName,
        middleName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
      });
  
      const saveUser = await user.save();
      res.status(201).json({ message: 'User added successfully', saveUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Failed to add user' });
    }
};

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
        signature: process.env.SIGN_IN_TOKEN_SECRET,  
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