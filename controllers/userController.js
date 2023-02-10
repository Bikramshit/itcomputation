import catchAsyncError from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto"
export const register=catchAsyncError(async(req,res,next)=>{
    const {name, email, phone, password, pan, department, designation, category} = req.body;
    if(!name || !email || !phone || !pan || !password || !department || !designation || !category) return next(new ErrorHandler("Please enter all field",400));
    
    let email_e = await User.findOne({email});
    let pan_e = await User.findOne({pan});
    let phone_e = await User.findOne({phone});
    if(pan_e || email_e || phone_e) return next(new ErrorHandler("User already exists",409));
    
    let user = await User.create({
        name,
        email,
        phone,
        password,
        pan,
        department,
        designation,
        category
    });
    sendToken(res,user,"Registered Successfully", 201);
})



export const login=catchAsyncError(async(req,res,next)=>{
    const { password, pan } = req.body;
    if( !pan || !password ) return next(new ErrorHandler("Please enter all field",400));
    
    let user = await User.findOne({pan}).select("+password");
    if(!user) return next(new ErrorHandler("User Doesn't Exist",401));
    
    const isMatch = await user.ComparePassword(password)
    if(!isMatch) return next(new ErrorHandler("Incorrect Email or Password",401));
    sendToken(res,user,`Welcome back, ${user.name}`, 201);
})


export const logout=catchAsyncError(async(req,res,next)=>{
    
    res.status(200).cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
        secure:true,
        sameSite:"none",
        
    }).json({
        success:true,
        message:"Logged out successfully"
    });
});

export const getMyProfile=catchAsyncError(async(req,res,next)=>{
    
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success:true,
        user
    });
});

export const changePasssword=catchAsyncError(async(req,res,next)=>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) return next(new ErrorHandler("Please enter all fields ", 400));
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.ComparePassword(oldPassword);
 
    if(!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));
    user.password = newPassword;
    await user.save();


    res.status(200).json({
        success:true,
        message:"Password Changed Successfully"
    });
});

export const updateProfile = catchAsyncError(async(req,res,next)=>{
    const {name, email} = req.body;
    const user = await User.findById(req.user._id);
    if(name) user.name=name;
    if(email) user.email = email;
    await user.save();

    res.status(200).json({
        success:true,
        message:"Profile updated Successfully"
    })
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(user);  
    if (!user) return next(new ErrorHandler("User not found", 400));
  
    const resetToken = await user.getResetToken();
  
    await user.save();
  
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;
  
    // Send token via email
    await sendEmail(user.email, "IT Computation Form Reset Password", message);
  
    res.status(200).json({
      success: true,
      message: `Reset Token has been sent to ${user.email}`,
    });
  });
  

export const resetPassword = catchAsyncError(async(req,res,next)=>{
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{
        $gt:Date.now(),
    },
});
    if(!user) return next(new ErrorHandler("Token is invalid or has been expired",));

    user.password = req.body.password;
    user.resetPasswordExpire=undefined;
    user.resetPasswordExpire=undefined;


    res.status(200).json({
        success:true,
        message:"Password changed Successfully"
    })
});


export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({});
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  
  export const ApproveUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) return next(new ErrorHandler("User not found", 404));
  
    if (user.role === "ap_user") user.role = "user";
    else user.role = "user";
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Approved successfully",
    });
  });
  
  export const MakeAdmin = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) return next(new ErrorHandler("User not found", 404));
  
    if (user.role === "user") user.role = "admin";
    else user.role = "user";
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Approved successfully",
    });
  });



  export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) return next(new ErrorHandler("User not found", 404));
  
  
    // Cancel Subscription
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });

  
  export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    await user.remove();
  
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "User Deleted Successfully",
      });
  });
  


  