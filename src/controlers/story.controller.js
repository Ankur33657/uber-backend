
const utils = require("../utils/utils");
const constant = require("../utils/constant")
const StoryService=require("../services/story.service")
const getStory = async (req, res) => {
    try {
        const response = await StoryService?.getStory();
        utils?.responseFormat(res,response?.code,response.message,response.data)
    } catch (error) {
        utils?.responseFormat(res, error?.code || constant?.ResponseCode.INTERNAL_SERVER_ERROR, error?.message);
    }
}

module.exports = { getStory };