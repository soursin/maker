import express,{Request , Response} from "express"
import * as dotenv from "dotenv"
import {z} from "zod"
import bcrypt from "bcrypt"
import { userModel } from "../model/db";
import jwt,{Secret} from "jsonwebtoken";
export const userRouter = express.Router();
dotenv.config();

interface User {
    username : String,
    email : String,
    password : String
}

userRouter.post("/signup", async (req : Request , res : Response) => {
   
    //Input Schema created with zod object
    const inputBody = z.object({
        username : z.string(),
        email : z.string().email(),
        password : z.string()
    });

    //Use safeParse to insert req.body if it according to schema then success otherwise it will be return 
    const validateBody = inputBody.safeParse(req.body);

    if(!validateBody.success){
        res.status(403).json({
            error : validateBody.error
        })
    }

    try{
        //Creating hash password with bcrypt with salting
        const hashPassword = await bcrypt.hash(req.body.password, 8);

        const user = await userModel.create({
            username : req.body.username,
            email : req.body.email,
            password : hashPassword
        })

        res.status(200).json({
            msg: "Sign up successfully"
        })

    }catch(e){

        res.status(500).json({
            msg : "Something Went Wrong"
        })

    }
})

userRouter.post("/login", async (req : Request , res : Response) => {

    const inputBody = z.object({
        email : z.string(),
        password : z.string()
    })

    const validateBody = inputBody.safeParse(req.body);

    if(!validateBody.success){
        res.status(403).json({
            error : validateBody.error
        })
        return
    }

    try{
        const validUser = await userModel.findOne({
            email : req.body.email 
        })

        if(!validUser){
            res.status(403).json({
                msg : "Invalid Email or Password"
            })
            return 
        }

        const comparePassword = await bcrypt.compare(req.body.password,validUser.password as string);

        if(!comparePassword){
            res.status(403).json({
                msg : "Invalid Password"
            })
            return 
        }

        const token = jwt.sign({
            userId : validUser._id.toString()
        },process.env.JWT_SECRET as Secret);

        res.status(200).json({
            token : token ,
            msg : "Signed In Successfully"
        })        

    }catch(e){

        res.status(500).json({
            msg : "Internal Server Error"
        })

    }
})