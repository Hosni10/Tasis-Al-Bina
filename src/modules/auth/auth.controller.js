import { userModel } from "../../../database/models/user.model.js"
import { generateToken, verifyToken } from "../../utilities/tokenFunction.js"
import crypto from 'crypto';
import {sendEmailService, sendVerificationEmail} from "../../services/sendEmailService.js"
import { nanoid } from "nanoid"
import { emailTemplate } from "../../utilities/emailTemplate.js";

import jwt from "jsonwebtoken";

export const signUp = async(req,res,next) => { 
    const {
        firstName,
        middleName,
        lastName,
        email,
        password,
        phoneNumber,
        role
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
     
    const user = new userModel({
        firstName,
        middleName,
        lastName,
        email,
        password,
        phoneNumber,
        role
    })
    const saveUser = await user.save()
    res.status(201).json({message:'User Added successfully', saveUser})
}  // ! for admin crate one account and will delete that api 


const verificationCodesAdd = new Map(); // Key: email, Value: { code, expiresAt }
export const sendEmailBinCode = async (req, res, next) => {
    const { email } = req.body;
    
   const verificationCode = crypto.randomInt(100000, 999999);

   verificationCodesAdd.set(email, {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  console.log(verificationCodesAdd);


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
  
   const storedCode = verificationCodesAdd.get(email);
   console.log(storedCode)
   
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


 export const forgetPassword = async(req,res,next) => {

  // console.log(process.env.SALT_ROUNDS);
  // console.log(process.env.RESET_TOKEN);
  
    const {email} = req.body


    const isExist = await userModel.findOne({email})
    if(!isExist){
        return res.status(400).json({message: "Email not found"})
    }

    const code = nanoid()
    const hashcode = pkg.hashSync(code,process.env.SALT_ROUNDS) // ! process.env.SALT_ROUNDS
    const token = generateToken({
        payload:{
            email,
            sendCode:hashcode,
        },
        signature: process.env.RESET_TOKEN, // ! process.env.RESET_TOKEN
        expiresIn: '1h',
    })
    const resetPasswordLink = `http://localhost:3000/auth/reset/${token}`
    const isEmailSent = sendEmailService({
        to:email,
        subject: "Reset Password",
        message: emailTemplate({
            link:resetPasswordLink,
            linkData:"Click Here Reset Password",
            subject: "Reset Password",
        }),
    })
    if(!isEmailSent){
        return res.status(400).json({message:"Email not found"})
    }

    const userupdete = await userModel.findOneAndUpdate(
        {email},
        {forgetCode:hashcode},
        {new: true},
    )
    return res.status(200).json({message:"password changed",userupdete})
}

export const resetPassword = async(req,res,next) => {
    const {verificationCode,newPassword,email} = req.body
    // const decoded = verifyToken({token, signature: process.env.RESET_TOKEN}) // ! process.env.RESET_TOKEN
    const user = await userModel.findOne({
        email: email,
        // fotgetCode:sentCode
    })

    if(!user){
        return res.status(400).json({message: "you are alreade reset it , try to login"})
    }

    const storedCode = verificationCodesAdd.get(email);
    console.log(storedCode)
    
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


    user.password = newPassword,
    user.forgetCode = null

    const updatedUser = await user.save()
    res.status(200).json({message: "Done",updatedUser})
}

export const logout = async (req, res, next) => {
  try {
      const { token } = req.body;
      if (!token) {
          return res.status(400).json({ message: "Token is required" });
      }

      // Verify token and extract email
      const decoded = jwt.verify(token, process.env.SIGN_IN_TOKEN_SECRET);

      if (!decoded || !decoded.email) {
          return res.status(401).json({ message: "Invalid token" });
      }

      const email = decoded.email; 

      console.log("Decoded email:", email);

      // Find the user
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Remove the token and update status
      await userModel.findOneAndUpdate(
          { email }, // ✅ Use the defined email variable
          { token: null, status: "offline" },
          { new: true }
      );

      res.status(200).json({ message: "Logout successful" });
  } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUser = async(req,res,next) => {
 
    //    const {page, size} = req.query
    //    const {limit, skip} = pagination({page, size}) 
       
       const user = await userModel.find()
       
       if(!user) return next(new Error("No user Founded",{cause:404}))
       
         const num = user.length
         res.status(201).json({message:`user Number : ${num}`,user})
    }

    const verificationCodesNew = new Map(); // Key: email, Value: { code, expiresAt }
    export const sendEmailBinCodeToAdd = async (req, res, next) => {
       const { email } = req.body;
       
      const verificationCode = crypto.randomInt(100000, 999999);
   
   
      verificationCodesNew.set(email, {
       code: verificationCode,
       expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
     });
   
     console.log(verificationCodesNew);
   
   
      try {
       await sendVerificationEmail(email, verificationCode);
       res.status(200).json({ message: 'Verification code sent successfully' });
     } catch (error) {
       console.error('Error sending email:', error);
       res.status(500).json({ error: 'Failed to send verification code' });
     }
   };

   