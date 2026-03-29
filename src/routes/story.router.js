const express = require("express");
const StoryRouter = express.Router();
const { userAuth } = require("../middlewares/authHandler")
const StoryControler = require("../controlers/story.controller")

StoryRouter.get("/getstory", userAuth, StoryControler?.getStory);

module.exports = StoryRouter;