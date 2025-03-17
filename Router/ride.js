const express=require("express");
const {UserAuth}=require('../utils/auth')
const rideRouter=express.Router();
const Ride =require('../Models/ride');

rideRouter.post('/requestride',UserAuth,async(req,res)=>{
try{
    const rideRequest=req.body;
    const user=req.user;
    const requestRide=new Ride({
        userId:user.userId,
        firstName:user.firstName,
        fromLocation:{
            latitude: rideRequest.fromLocation.latitude,
            longitude: rideRequest.fromLocation.longitude,
        },
        toLocation:{
            latitude: rideRequest.toLocation.latitude,
            longitude: rideRequest.toLocation.longitude,
        }
    });
    await requestRide.save();
    res.status(200).json("Searching a rider");
}
catch(err){
    req.status(400).json("ERROR:",err.message);
}
   
})

module.exports=rideRouter;