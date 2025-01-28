import { google } from "googleapis";
import fs from "fs";
import path from "path";

const credentials = {
  web: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URL,
    token_uri: process.env.TOKEN_URL,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [process.env.REDIRECT_URLS],
  },
};  // TODO -> save the data in env file

const { client_id, client_secret, redirect_uris } = credentials.web;
console.log(client_id);
console.log(client_secret);
console.log(redirect_uris);
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const TOKEN_PATH = path.join(process.cwd(), "token.json");

const authenticateGoogle = async () => {
  console.log(client_id);
  console.log(client_secret);
  console.log(redirect_uris);
  
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oAuth2Client.setCredentials(token);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });

    console.log("Authorize this app by visiting this URL:", authUrl);
    throw new Error("Please authorize the app and generate a token by visiting the above URL.");
  }

  return oAuth2Client;
};



export { oAuth2Client, authenticateGoogle };
