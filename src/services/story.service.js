const constant=require("../utils/constant")
const StoryScheme=require("../models/story.model")
const getStory = async () => {
    const story = await StoryScheme.find().populate(
      "user",
      "name profileImage",
    ).sort({ createdAt: -1 });
    return {code:constant?.ResponseCode?.OK,message:"Stories fetch successfully",data:story}
}

module.exports={getStory}