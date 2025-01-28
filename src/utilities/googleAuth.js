import { google } from "googleapis";
import fs from "fs";
import path from "path";

const credentials = {
  web: {
    client_id: "92007311702-2kmkhoiecutfl4epru0e751ctbcsppnb.apps.googleusercontent.com",
    project_id: "tasis-449018",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: ["http://localhost:8080/oauth/callback"],
  },
};  // TODO -> save the data in env file

const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const TOKEN_PATH = path.join(process.cwd(), "token.json");

const authenticateGoogle = async () => {
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
