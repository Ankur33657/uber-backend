const express = require("express");
const CommunityRouter = express.Router();
const { userAuth } = require("../middlewares/authHandler");
const CommunityControler = require("../controlers/community.controller");

CommunityRouter.get("/getfeedpost", userAuth, CommunityControler?.getfeedPost);
CommunityRouter.post("/createpost",userAuth,CommunityControler?.createfeedPost)

module.exports = CommunityRouter;
