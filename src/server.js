const express = require("express");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();
app.use(express.json());



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
