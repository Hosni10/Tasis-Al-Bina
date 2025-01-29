import { google } from "googleapis";
import {  oAuth2Client } from "../../utilities/googleAuth.js";


export const createMeeting = async (req, res, next) => {
  try {
    const oAuth2Client = req.oAuth2Client; // Get the client from the middleware

    // Extract meeting details from the request body
    const { dateTimeStart, dateTimeEnd, email } = req.body;
    if (!dateTimeStart || !dateTimeEnd || !email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Authenticate with Google Calendar API
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Define the event
    const event = {
      summary: "Google Meet Meeting",
      description: "This meeting was created using Google API.",
      start: {
        dateTime: dateTimeStart,
        timeZone: "Asia/Riyadh",
      },
      end: {
        dateTime: dateTimeEnd,
        timeZone: "Asia/Riyadh",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: "sample123",
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // Create the event
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    // Send the response
    return res.status(201).json({
      message: "Meeting created successfully.",
      hangoutLink: response.data.hangoutLink,
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};


export const callBack =  async (req, res) => {
    console.log('Received OAuth callback:', req.query);

    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send('Error: Code not found.');
    }
  
    try {
      // Exchange the authorization code for an access token
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
  
      // Log the tokens to confirm they're received
      console.log('Tokens:', tokens);
  
      // Optionally, you can store these tokens (e.g., in a session, database, or in-memory storage)
      res.send('OAuth flow completed successfully! Tokens are now available.');
    } catch (error) {
      console.error('Error during OAuth callback:', error);
      res.status(500).send('Error processing OAuth callback.');
    }
  }