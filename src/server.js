const express = require("express");
const mongoose = require("mongoose");
const UserRouter = require("./routes/user.route");
const CaptainRouter = require("./routes/captain.router");
const cookieParser = require("cookie-parser");
const RideRouter = require("../src/routes/ride.router");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { initializeSocket } = require("./sockets/socket");

require("dotenv").config();

initializeSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", UserRouter);
app.use("/api/captain", CaptainRouter);
app.use("/api/ride", RideRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
