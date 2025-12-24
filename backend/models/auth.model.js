import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    bloodGroup:{
        type:String,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"],},
},{timestamps:true});





userSchema.pre("save",async function (){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10)
})
userSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
            role:this.role
            

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken=function(){
   return jwt.sign(
       {
           _id:this._id,
           

       },
       process.env.REFRESH_TOKEN_SECRET,
       {
           expiresIn: process.env.REFRESH_TOKEN_EXPIRE || process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}


const User=mongoose.model("User",userSchema);
export default User;