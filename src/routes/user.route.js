const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controlers/user.controller");
const { userAuth } = require("../middlewares/authHandler");

UserRouter.get("/login", UserController.loginUser);
UserRouter.post("/signup", UserController.signUpUser);
UserRouter.get("/logout", UserController.logoutUser);
UserRouter.get("/profile", userAuth, UserController.UserProfile);


module.exports = UserRouter;