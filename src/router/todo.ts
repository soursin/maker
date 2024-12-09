import express,{Request , Response} from "express"
import { auth } from "../auth/userMiddleware"
import { todoModel } from "../model/db";
import { z } from "zod";
export const todoRouter = express.Router();

interface CustomReq extends Request{
    userId : String
}

todoRouter.get("/", auth ,async (req : Request , res : Response) => {
    const userId = (req as CustomReq).userId;

    try{
        const posts = await todoModel.find({
            userId
        })
        // }).populate("userId",["username"])

        res.status(200).json({
            contents : posts
        })

    }catch(e){
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }
})

todoRouter.post("/add", auth ,  async (req : Request , res : Response) => {
    const userId = (req as CustomReq).userId;
    const inputSchema = z.object({
        title : z.string(),
        done : z.boolean()
    })

    const validateInput = inputSchema.safeParse(req.body);
    if(!validateInput.success){
        res.status(403).json({
            msg : "Invalid Inputs",
            error : validateInput.error
        })
    }

    try{
        const post = await todoModel.create({
            title : req.body.title,
            done : req.body.done,
            userId : userId
        })

        res.status(200).json({
            msg : "Added Todo Successfully"
        })

    }catch(e){
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }
})

todoRouter.put("/update", auth , async (req : Request , res : Response) => {
    const inputSchema = z.object({
        postid : z.string(),
        title : z.string().optional(),
        done : z.boolean().optional()
    })
    const validateInput = inputSchema.safeParse(req.body);
    if(!validateInput.success){
        res.status(403).json({
            error : validateInput.error
        })
        return 
    }
    try{
        const verify = await todoModel.findOne({
            _id : req.body.postid
        })

        if(verify){
            const post = await todoModel.findByIdAndUpdate({
                _id : req.body.postid
            },{
                title : req.body.title,
                done : req.body.done
            },{new : true})

            res.json({
                msg : "Update successfully",
                content: post
            })

        }else{
            res.status(404).json({
                msg : "Post does not exist"
            })
        }
            
        }catch(e){
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }

})
  

todoRouter.delete("/remove", auth , async (req : Request , res : Response) => {
    const inputSchema = z.object({
        postid : z.string()
    })
    const validateInput = inputSchema.safeParse(req.body);
    if(!validateInput.success){
        res.status(403).json({
            error : validateInput.error
        })
        return 
    }
    try{
        const verify = await todoModel.findOne({
            _id : req.body.postid
        })

        if(verify){
            const content = await todoModel.deleteMany({
                _id : req.body.postid
            })
    
            res.status(200).json({
                msg : "Deleted Successfully"
            })

        }else{
            res.status(404).json({
                msg : "Id does not exists"
            })
        }

    }catch(e){
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }
})