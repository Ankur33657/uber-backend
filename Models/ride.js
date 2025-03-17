const mongoose =require("mongoose");
const RideSchema=new mongoose.Schema({
    userId:{
        type:String,
      
    },
    firstName:{
        type:String,
    },
    fromLocation:{
        type:{
            latitude: Number,
            longitude: Number,
        },
        required:true
    },
    toLocation:{
        type:{
            latitude: Number,
            longitude: Number,
        },
        required:true
    },
    destination:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model("ride",RideSchema)