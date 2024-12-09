import mongoose,{Schema,model} from "mongoose";

const userSchema = new Schema({
    username : {type : String , require: true , unique : true},
    email : {type : String , require : true , unique : true}, 
    password : {type : String , require: true}
})


const todoSchema = new Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , require : true ,ref : "users"},
    title : {type : String , require : true },
    done : {type : Boolean , require : true}
})


export const userModel = mongoose.model("users",userSchema);
export const todoModel = mongoose.model("todos",todoSchema);