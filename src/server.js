const express = require("express");
const mongoose = require("mongoose");
const UserRouter = require("./routes/user.route");
const CaptainRouter = require("./routes/captain.router");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", UserRouter);
app.use("/api/captain", CaptainRouter);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
