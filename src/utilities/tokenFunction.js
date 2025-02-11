import jwt from 'jsonwebtoken'

// ========================= generation ==============================
export const generateToken = ({
  payload = {},
  signature = process.env.DEFAULT_SIGNATURE, // ! process.env.DEFAULT_SIGNATURE
  expiresIn = '1d',
} = {}) => {
  // check if the payload is empty object
  if (!Object.keys(payload).length) {
    return false
  }
  const token = jwt.sign(payload, signature, { expiresIn })
  return token
}

// =========================  Verify ==============================
export const verifyToken = ({
  token = '',
  signature = process.env.DEFAULT_SIGNATURE, // ! process.env.DEFAULT_SIGNATURE

} = {}) => {
  // check if the payload is empty object
  // console.log("token from verifyToken",token);
  
  if (!token) {
    return false
  }
  
  let data;
  
          try {
                 data = jwt.verify(token, signature);
               } catch (error) {
                 if (error.name === "TokenExpiredError") {
                   // إذا انتهت صلاحية التوكن، نقوم فقط بفك تشفيره بدون التحقق منه
                   data = jwt.decode(token);
                 } else {
                   return res.status(401).json({ message: "Invalid token" });
                 }
               }

        //  console.log(data);
         
       
  
  return data
}