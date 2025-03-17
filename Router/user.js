const express=require("express");
const userRouter=express.Router();
const User=require("../Models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserAuth}=require("../utils/auth")

userRouter.post('/signup',async(req,res)=>{
    try{

        const {userId,firstName,emailId,password}=req.body;
        const ispresent=await User.findOne({
            $or:[
                {emailId:emailId},
                {userId:userId}
            ]
        });
        if(ispresent)return res.status(400).json("User already existed");
        const hashPassword= await bcrypt.hash(password,12);
        const user=new User({
            userId:userId,
            firstName:firstName,
            emailId:emailId,
            password:hashPassword
        })
        await user.save();
        res.status(200).json("User created successfully");
    }catch(err){
        res.status(400).json("ERROR: "+ err.message);
    }

})

userRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        if(!emailId || !password)return res.status(400).json("Incorrect data");
        const user=await User.findOne({emailId:emailId});
        if(!user)return res.status(400).json("Incorrect data");
        const isCorrectPassword=await bcrypt.compare(password,user.password);
        if(!isCorrectPassword)return res.status(400).json("Incorrect data");

        const token=await jwt.sign({ _id:user._id}, process.env.SECRET_KEY);
        res.cookie("token",token);

        res.status(200).json({userId:user.userId,firstName:user.firstName,emailId:user.emailId});
    }catch(err){
        res.status(400).json("ERROR: "+ err.message);
    }
   
})

userRouter.get('/profile',UserAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.status(200).json({userId:user.userId,firstName:user.firstName,lastName:user.lastName,emailId:user.emailId});
    }catch(err){
        res.status(400).json("Login first");
    }
    

})

userRouter.get('/logout',async(req,res)=>{
    try{
        res.clearCookie('token',null).json("Logout successfull");
    }catch(err){
        res.status(400).json(err.message);
    }
})

userRouter.patch('/profile/edit', UserAuth,async(req,res)=>{
    try{
        const user=req.user;
        const update=req.body;
        if(update.userId)throw new Error("userId should not be updated");
        if(update.emailId)throw new Error("Email should not be updated");
        if(update.password)throw new Error("Password should not be updated");
        const updatedData=await User.findOneAndUpdate({_id:user._id},update,{runValidators:true});
        await updatedData.save();
        res.status(200).json("update successfully");

    }catch(error){
        res.status(400).json(error.message);
    }

        
})


module.exports=userRouter;