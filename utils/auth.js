const express=require("express");
const jwt = require('jsonwebtoken');
const User=require('../Models/user');
const UserAuth=async(req,res,next)=>{
   try{
      const {token}=req.cookies;
      if(!token)res.status(404).json("Unauthorized access,Login first");

      const decodemsg=await jwt.verify(token,process.env.SECRET_KEY);
      const {_id}=decodemsg;
      const user=await User.findById(_id);
      if(!user){
        res.status(404).json("Unauthorized access,Login first");
      }
      req.user=user;
      next();
   }catch(err){
    res.status(404).json("Unauthorized access,Login first");
   }
}
module.exports={UserAuth};