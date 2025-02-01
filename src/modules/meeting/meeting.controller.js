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
    // console.log('Received OAuth callback:', req.query);

    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send('Error: Code not found.');
    }
  
    try {
      // Exchange the authorization code for an access token
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
  
      // Log the tokens to confirm they're received
      const accessToken = tokens.access_token;

      if (!accessToken) {
          return res.status(500).send('Error: Access token not found.');
      }

      // Send styled HTML response with the access token and copy functionality
      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>OAuth Success</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f7fc;
                      margin: 0;
                      padding: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                  }
                  .container {
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                      width: 400px;
                      text-align: center;
                  }
                  h1 {
                      color: #28a745;
                      font-size: 24px;
                  }
                  p {
                      color: #333;
                      font-size: 16px;
                      margin-bottom: 20px;
                  }
                  pre {
                      background-color: #f8f9fa;
                      padding: 10px;
                      border-radius: 4px;
                      font-size: 14px;
                      overflow-x: auto;
                      word-wrap: break-word;
                      text-align: left;
                  }
                  .button {
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #ffffff;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 16px;
                      text-decoration: none;
                      margin-top: 10px;
                  }
                  .button:hover {
                      background-color: #0056b3;
                  }
                  .copy-button {
                      margin-top: 20px;
                      background-color: #28a745;
                  }
                  .copy-button:hover {
                      background-color: #218838;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>OAuth Flow Completed Successfully!</h1>
                  <p>Your access token is now available:</p>
                  <pre id="token">${accessToken}</pre>
                  <button class="button copy-button" id="copyButton">Copy Token to Clipboard</button>
                  <a href="/" class="button">Go to Homepage</a>
              </div>
              <script>
                  // Function to copy the token to clipboard
                  document.getElementById('copyButton').addEventListener('click', () => {
                      const tokenText = document.getElementById('token').innerText;
                      navigator.clipboard.writeText(tokenText)
                          .then(() => {
                              alert('Token copied to clipboard!');
                          })
                          .catch(err => {
                              alert('Failed to copy token: ' + err);
                          });
                  });
              </script>
          </body>
          </html>
      `);

    } catch (error) {
      console.error('Error during OAuth callback:', error);
      res.status(500).send('Error processing OAuth callback.');
    }
  }


