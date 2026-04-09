const express = require("express");
const StoryRouter = express.Router();
const { Auth } = require("../middlewares/anyAuthenticHandler");
const StoryControler = require("../controlers/story.controller");

StoryRouter.get("/getstory", Auth, StoryControler?.getStory);
StoryRouter.post("/createstory", Auth, StoryControler?.CreateStory);

StoryRouter.get("/getalllastmonthnews", Auth, StoryControler?.getLastMonthNews);

module.exports = StoryRouter;
