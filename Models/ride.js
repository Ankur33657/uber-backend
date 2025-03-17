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
    status:{
        type:String,
        enum:["riderequest","accepted","shareride","shared","completed","rejected"],
        required:true
    },
    fare:{
        type:Number
      
    },
    distance:{
        type:Number
       
    }
},{timestamps:true})

module.exports=mongoose.model("ride",RideSchema)