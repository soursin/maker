import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();

//Middleware
app.use(express.json());



async function main(){
    app.listen(3000);
    await mongoose.connect(process.env.DB_URL as string);
    console.log("DB Connected");
}

main();