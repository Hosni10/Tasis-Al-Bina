import { oAuth2Client, authenticateGoogle } from "../utilities/googleAuth.js";
import { google } from "googleapis";

// Middleware to handle Google OAuth token
export const googleAuthMiddleware = async (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token found, send OAuth authorization URL
      const redirectUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar"],
      });
      return res.status(401).json({
        message: "Authorization token missing or invalid.",
        authUrl: redirectUrl,
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    // Initialize OAuth2 client and set the token
    const oAuth2ClientInstance = new google.auth.OAuth2();
    oAuth2ClientInstance.setCredentials({ access_token: token });

    // Attach the client to the request object
    req.oAuth2Client = oAuth2ClientInstance;

    next(); // Proceed to the next middleware or route
  } catch (error) {
    // If error occurs during the process
    res.status(401).json({ 
      message: "Error during authorization.", 
      error: error.message 
    });
  }
};
