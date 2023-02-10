import catchAsyncError from "./catchAsyncError.js";
import  jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/User.js";



export const isAuthenticated = catchAsyncError(async(req,res,next)=> {
    const {token} = req.cookies;

    if(!token) return next(new ErrorHandler("Not logged In", 401));

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
})


export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
      return next(
        new ErrorHandler(
          `${req.user.role} is not allowed to access this resource`,
          403
        )
      );
  
    next();
  };


  export const authorizeUser = (req, res, next) => {
    if (req.user.role !== "user")
      return next(
        new ErrorHandler(
          `${req.user.role} is not allowed to access this resource`,
          403
        )
      );
  
    next();
  };