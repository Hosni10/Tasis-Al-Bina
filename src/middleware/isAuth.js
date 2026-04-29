import { userModel } from '../../database/models/user.model.js';
import { generateToken, verifyToken } from '../utilities/tokenFunction.js';
export const isAuth = (roles) => {
  return async (req, res, next) => {
    try {
      

      // console.log("Authorization Header:");
      
      const { authorization } = req.headers;
      if (!authorization) {
        return next(new Error('Please login first', { cause: 400 }));
      }


      
      const splitedToken = authorization.split(' ')[1];

        // console.log(splitedToken);
      
      try {
        // Verify token
        const decodedData = verifyToken({
          token: splitedToken,
          signature: process.env.SIGN_IN_TOKEN_SECRET,
        });
        

        
        // console.log('Decoded Token Data:', decodedData);

        // Find user
        const findUser = await userModel.findById(decodedData._id, 'email userName role');
        if (!findUser) {
          return res.status(401).json({ message: 'Invalid token' });
        }

        // console.log("findUser",findUser);
        
        // console.log("User Data:",findUser.role);
        // console.log("Roles Allowed:",roles);
        
        // Check role
        // console.log('Roles Allowed:', roles);
        // console.log('User Role:', findUser.role);
        
        if (!roles.includes(findUser.role)) {
          return next(new Error('Unauthorized to access this API', { cause: 403 }));
        }

        // If the role is correct, attach the user to the request object
        console.log("allowed");
        req.authUser = findUser;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
        //   console.log('Token expired, attempting refresh...');
          const user = await userModel.findOne({ token: splitedToken });

          if (!user) {
            return next(new Error('Wrong token', { cause: 400 }));
          }

          const newToken = generateToken({
            payload: { email: user.email, _id: user._id },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1y',
          });

          await userModel.findOneAndUpdate({ token: splitedToken }, { token: newToken });

          return res.status(200).json({ message: 'Token refreshed', userToken: newToken });
        }

        console.error('JWT Verification Error:', error.message);
        return next(new Error('Invalid token', { cause: 400 }));
      }
    } catch (error) {
      console.error('Catch Error in Auth Middleware:', error.message);
      next(new Error('Catch error in auth', { cause: 500 }));
    }
  };
};





