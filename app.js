import express from "express";
const app = express();
import { config } from 'dotenv'
import path from 'path'
import { initiateApp } from "./src/utilities/initiateApp.js";
config({path: path.resolve('./config/.env')})


initiateApp(app,express)
