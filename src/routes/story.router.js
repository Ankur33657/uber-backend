const express = require("express");
const StoryRouter = express.Router();
const { userAuth } = require("../middlewares/authHandler");
const StoryControler = require("../controlers/story.controller");

StoryRouter.get("/getstory", userAuth, StoryControler?.getStory);
StoryRouter.post("/createstory", userAuth, StoryControler?.CreateStory);

StoryRouter.get(
  "/getalllastmonthnews",
  userAuth,
  StoryControler?.getLastMonthNews,
);

module.exports = StoryRouter;
