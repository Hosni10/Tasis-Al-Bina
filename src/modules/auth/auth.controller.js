import { userModel } from "../../../database/models/user.model.js"
import { generateToken, verifyToken } from "../../utilities/tokenFunction.js"
import crypto from 'crypto';
import { sendVerificationEmail} from "../../services/sendEmailService.js"
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





export const addUser = async (req, res, next) => {
    try {
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      console.log(req.body);
      
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
  
   const storedCode = verificationCodesNew.get(email);
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
      console.log('User added successfully:', saveUser);
      res.status(201).json({ message: 'User added successfully', saveUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Failed to add user' });
    }
};

import pkg from 'bcrypt'
import { decode } from "punycode";
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
        // expiresIn: '1h',
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

const verificationCodesAdd = new Map(); // Key: email, Value: { code, expiresAt }
 export const sendEmailBinCode = async (req, res, next) => {
    const { email } = req.body;
    
   const verificationCode = crypto.randomInt(100000, 999999);


   const isEmailExsist = await userModel.findOne({email:email})

   if(!isEmailExsist) return next(new Error('Eamil Not Found',{cause:404}))

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

 export const forgetPassword = async(req,res,next) => {

  // console.log(process.env.SALT_ROUNDS);
  // console.log(process.env.RESET_TOKEN);
  const verificationCode = crypto.randomInt(100000, 999999);

   verificationCodesAdd.set(email, {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  console.log(verificationCodesAdd);

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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SIGN_IN_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // إذا انتهت صلاحية التوكن، نقوم فقط بفك تشفيره بدون التحقق منه
        decoded = jwt.decode(token);
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const email = decoded.email;

    console.log("Decoded email:", email);

    // البحث عن المستخدم
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحديث حالة المستخدم إلى "offline" حتى لو كان التوكن منتهي الصلاحية
    await userModel.findOneAndUpdate(
      { email },
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
   
   const users = await userModel.find()
   
   if(!users) return next(new Error("No users Founded",{cause:404}))
   
     const num = users.length
     res.status(201).json({message:`users Number : ${num}`,users})
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

   

   export const getOneUser= async (req, res, next) => {
      try {

  const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: "Token is required" });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SIGN_IN_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // إذا انتهت صلاحية التوكن، نقوم فقط بفك تشفيره بدون التحقق منه
        decoded = jwt.decode(token);
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    

    
        const id = decoded._id;
        
        
        
        const user = await userModel.findById(id);
        if (!user) {
          return next(new Error('user not found', { cause: 404 }));
        }

        
         
        res.status(200).json({ message: 'Done',user});
      } catch (error) {
        next(new Error(`Error deleting user: ${error.message}`, { cause: 500 }));
      }
    };
   

export const updateUser = async(req,res,next) => {
      // console.log("ddd");
      // console.log(req.body);
      
      
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      const token = authHeader.split(' ')[1];
      
      let decoded;
      
      try {
        decoded = jwt.verify(token, process.env.SIGN_IN_TOKEN_SECRET);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          // إذا انتهت صلاحية التوكن، نقوم فقط بفك تشفيره بدون التحقق منه
          decoded = jwt.decode(token);
        } else {
          return res.status(401).json({ message: "Invalid token" });
        }
      }
        
      if (!decoded || !decoded._id) {
        return res.status(401).json({ message: "Invalid token" });
      }
      
  
      
          const id = decoded._id;
          
          
          
      try {
         const {firstName,
          middleName,
          lastName,
          phoneNumber,
          } = req.body
      
        const user = await userModel.findById(id)
      
        if(!user) {
          return next(new Error("user Didn't Found",{cause:400}))
        }
      //   microservice archeture and distributed systems
        if(firstName) user.firstName = firstName
        if(middleName) user.middleName = middleName
        if(lastName) user.lastName = lastName
        if(phoneNumber) user.phoneNumber = phoneNumber
        
      //   if(req.file){
      //     await destroyImage(user.Image.public_id);  
      
      // //   const uploadResult = await imagekit.upload({
      // //     file: req.file.buffer, 
      // //     fileName: req.file.originalname,  
      // //     folder: `${process.env.PROJECT_FOLDER}/user/${user.customId}`, 
      // //   });
      
      // //   user.Image.secure_url = uploadResult.url,
      // //   user.Image.public_id = uploadResult.fileId
      // // }
      
        await user.save()
        res.status(200).json({message : "user updated successfully",user})
      }  catch (error) {
        next(new Error(`fail to upload${error.message}`, { cause: 500 }));
      }
     
    }


    export const deleteUser = async (req,res,next) => {
        try{
          const id = req.params.id
            
          
             const user = await userModel.findByIdAndDelete(id)
             if(!user) return next(new Error("didn't found the question .",{cause:404}))
             
    
             res.status(201).json({message : "User Deleted sucessfully"})
           }  catch (error) {
             next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
           }
    }


    export const updateUserFromSuperAdmin = async(req,res,next) => {
     
     
      const id = req.params.id;
          console.log(id);
          
      try {
         const {firstName,
          middleName,
          lastName,
          phoneNumber,
          } = req.body
      
        const user = await userModel.findById(id)
      
        if(!user) {
          return next(new Error("user Didn't Found",{cause:400}))
        }
 
        if(firstName) user.firstName = firstName
        if(middleName) user.middleName = middleName
        if(lastName) user.lastName = lastName
        if(phoneNumber) user.phoneNumber = phoneNumber
      
        await user.save()
        res.status(200).json({message : "user updated successfully",user})
      }  catch (error) {
        next(new Error(`fail to upload${error.message}`, { cause: 500 }));
      }
    }


    export const usersCount = async(req,res,next) => {
      try {
        const count = await userModel.countDocuments();
        if(!count) return next(new Error("didn't found the question .",{cause:404}))
        res.status(200).json({ count });
      } catch (error) {
        next(new Error(`fail to upload${error.message}`, { cause: 500 }));
      }
    }