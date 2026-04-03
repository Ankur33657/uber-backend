const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controlers/user.controller");
const { userAuth } = require("../middlewares/authHandler");

UserRouter.post("/login", UserController.loginUser);
UserRouter.post("/signup", UserController.signUpUser);
UserRouter.get("/logout", UserController.logoutUser);
UserRouter.get("/profile", userAuth, UserController.UserProfile);
UserRouter.patch("/profile/edit", userAuth, UserController?.updateProfile);

module.exports = UserRouter;
