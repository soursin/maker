import express,{Request , Response} from "express"
import { auth } from "../auth/userMiddleware"
export const todoRouter = express.Router();


todoRouter.get("/", auth ,async (req : Request , res : Response) => {

})

todoRouter.post("/add", auth ,  async (req : Request , res : Response) => {
    
})

todoRouter.put("/update", auth , async (req : Request , res : Response) => {
    
})

todoRouter.delete("/remove", auth , async (req : Request , res : Response) => {
    
})