const express=require("express");
const mongoose=require("mongoose");
const userRouter=require("./Router/user");
const rideRouter=require('./Router/ride');
const cookieParser = require('cookie-parser');
const app=express();

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use('/api',userRouter);
app.use('/ride',rideRouter)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
     app.listen(process.env.PORT,()=>{
          console.log("server listen");
     })
})
.catch((err)=>{
  console.log(err.message);
})