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


// Use Redis or MongoDB to store verification codes instead of Map
export const sendEmailBinCodeToAdd = async (req, res, next) => {
  const { email } = req.body;
  const verificationCode = crypto.randomInt(100000, 999999);
  
  // First check if email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
      return next(new Error('Email already registered'));
  }

  // Store verification code in database
  await tempVerificationModel.create({
      email,
      code: verificationCode,
      // expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  await sendVerificationEmail(email, verificationCode);
  res.status(200).json({ message: 'Verification code sent successfully' });
};

export const addUser = async (req, res, next) => {
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

  // Get verification code from database
  const storedVerification = await tempVerificationModel.findOne({ 
      email,
      code: verificationCode,
      // expiresAt: { $gt: Date.now() }
  });

  

  if (!storedVerification) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  const user = await userModel.create({
      firstName,
      middleName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
  });

  // Clean up verification code
  await tempVerificationModel.deleteOne({ email });

  res.status(201).json({ message: 'User added successfully', user });
};





import pkg from 'bcrypt'
import { decode } from "punycode";
import { tempVerificationModel } from "../../../database/models/tempVerification.model.js";
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

    // console.log("Decoded email:", email);

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
   
    // Option 1: Add the verification code to the user model temporarily
export const sendEmailBinCode = async (req, res, next) => {
  const { email } = req.body;
  const verificationCode = crypto.randomInt(100000, 999999);
  
  const user = await userModel.findOne({email});
  if(!user) return next(new Error('Email Not Found',{cause:404}));

  // Store the code and expiry in the user document
  user.verificationCode = verificationCode;
  user.codeExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  try {
      await sendVerificationEmail(email, verificationCode);
      res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send verification code' });
  }
};

export const resetPassword = async(req,res,next) => {
  const {verificationCode, newPassword, email} = req.body;
  
  const user = await userModel.findOne({email});
  if(!user) {
      return res.status(400).json({message: "User not found"});
  }

  if (!user.verificationCode || user.verificationCode !== parseInt(verificationCode)) {
      return res.status(400).json({ error: 'Invalid verification code' });
  }

  if (user.codeExpiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code expired' });
  }

  user.password = newPassword;
  user.verificationCode = null;
  user.codeExpiresAt = null;

  const updatedUser = await user.save();
  res.status(200).json({message: "Password reset successfully", updatedUser});
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
          // console.log(id);
          
      try {
         const {firstName,
          middleName,
          lastName,
          phoneNumber,
          role
          } = req.body

          
      
        const user = await userModel.findById(id)
      
        if(!user) {
          return next(new Error("user Didn't Found",{cause:400}))
        }
 
        if(firstName) user.firstName = firstName
        if(middleName) user.middleName = middleName
        if(lastName) user.lastName = lastName
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(role) user.role = role
      
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