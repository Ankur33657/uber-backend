const express=require("express");
const {UserAuth}=require('../utils/auth')
const rideRouter=express.Router();
const Ride =require('../Models/ride');

rideRouter.post('/requestride',UserAuth,async(req,res)=>{
try{
    const rideRequest=req.body;
    const user=req.user;
    const previousRide=await Ride.find({
        userId:user.userId,
    
            $or:[
                {status:"riderequest"},
                {status:"accepted"},
                {status:"shareride"}
            ]
        
    })
    if(previousRide){
        throw new Error("You have already ride pending");
    }
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
        },
        status:rideRequest.status,
        distance:rideRequest.distance,
        fare:rideRequest.distance*process.env.FIXED_RATE
        
    });
    await requestRide.save();
    res.status(200).json("Searching a rider");
}
catch(err){
    res.status(400).json({message: err.message});
}
   
})

rideRouter.post('/shareride', UserAuth, async (req, res) => {
    try {
        const { fare } = req.body;
        const user = req.user;

        const validRequest = await Ride.findOne({
            userId: user.userId,
            status: "accepted"
        });

        if (!validRequest) {
            throw new Error("Invalid request");
        }

        validRequest.status = "shareride";
      
        await validRequest.save();

        res.status(200).json({ message: "Share ride requested successfully, waiting for others to accept" });

    } catch (err) {
        res.status(400).json({ message: "ERROR: " + err.message });
    }
});

rideRouter.get('/getshareride',UserAuth,async(req,res)=>{
    try{
        const {userId}=req.user;
        const shareRide=await Ride.find({
            userId:{
                $ne:userId
            },
           status:"shareride"
        })
        res.status(200).json({message:"getting all request",shareRide});
    }catch(err){
        res.status(400).json({message:"ERROR :"+ err.message})
    }
    

})



module.exports=rideRouter;