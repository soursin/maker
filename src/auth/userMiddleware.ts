import express,{Request , Response , NextFunction} from "express"
import * as dotenv from "dotenv"
import jwt,{JwtHeader, JwtPayload, Secret} from "jsonwebtoken"

dotenv.config();

interface CustomReq extends Request{
    userId : String
}

export function auth(req : Request , res : Response , next : NextFunction){
    const bearerToken = req.headers["authorization"];
    const token = bearerToken?.split(" ")[1];

    const decode = jwt.verify(token as string, process.env.JWT_SECRET as Secret) as JwtPayload;
    
    if(decode){
        (req as CustomReq).userId = decode.userId;
        next()
    }else{
        res.status(404).json({
            msg : "Not a valid token"
        })
    }

}
