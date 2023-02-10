import mongoose, { Schema } from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"]
    },
    department:{
        type:String,
        required:[true, "Please enter your department/section"],
    },
    designation: {
        type:String,
        required:[true, "Please enter your designation"],
    },
    category: {
        type:String,
        required:[true, "Please enter your category"],
    },
    employer: {
        type:String,
        default :"Aliah University"
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:validator.isEmail
    },
    pan:{
        type:String,
        required:[true, "Please enter your pan"],
        unique:true
    },
    phone:{
        type:String,
        required:[true, "Please enter your phone number"],
        validate:validator.isMobilePhone,
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minlength:[6, "Password must be at least 6 characters long"],
        select:false,
    },
    role:{
        type:String,
        enum:["admin", "user", "ap_user"],
        default:"ap_user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    ResetPasswordToken:String,
    ResetPasswordExpire:String


});
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await Bcrypt.hash(this.password, 10)
   next();
})
UserSchema.methods.getJWTToken = function (){
    return Jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:"30d"});

}
UserSchema.methods.ComparePassword = async function (password){
    return await Bcrypt.compare(password,this.password)

}
UserSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

export const User = mongoose.model("User", UserSchema);