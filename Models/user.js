const mongoose=require("mongoose");
var validator=require("validator");
const UserSchema=new mongoose.Schema({
    userId:{
        type:String,
        unique:true,
        required:true,
        maxLength:12,
        minLength:5
    },
    firstName:{
        type:String,
        requires:true,
        minLenght:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        minLenght:3,
        maxLength:20,


    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }

    },
    isPremium:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Make strong password");
            }
        }
    }

},{timestamps:true});
module.exports=mongoose.model("user",UserSchema)