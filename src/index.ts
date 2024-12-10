import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./router/user";
import { todoRouter } from "./router/todo";
dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/todo",todoRouter);



async function main(){
    app.listen(3000);
    await mongoose.connect(process.env.DB_URL as string);
    console.log("DB Connected");
}

main();