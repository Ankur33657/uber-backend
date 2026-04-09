const express = require("express");
const CommunityRouter = express.Router();
const { Auth } = require("../middlewares/anyAuthenticHandler");
const CommunityControler = require("../controlers/community.controller");

CommunityRouter.get("/getfeedpost", Auth, CommunityControler?.getfeedPost);
CommunityRouter.post("/createpost", Auth, CommunityControler?.createfeedPost);
CommunityRouter.patch("/updatepost", Auth, CommunityControler?.updatePost);
CommunityRouter.delete("/deletepost", Auth, CommunityControler?.deletePost);
module.exports = CommunityRouter;
