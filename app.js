import express from "express";
import { config } from 'dotenv'
import path from 'path'
config({path: path.resolve('./config/.env')})
import { initiateApp } from "./src/utilities/initiateApp.js";
import color from "@colors/colors"


const app = express()
initiateApp(app,express)