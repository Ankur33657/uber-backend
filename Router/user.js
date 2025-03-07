const express=require("express");
const userRouter=express.Router();
const User=require("../Models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports=userRouter;