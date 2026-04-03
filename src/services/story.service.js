const constant = require("../utils/constant");
const StoryScheme = require("../models/story.model");
const getStory = async () => {
  const story = await StoryScheme.find({ expiresAt: { $gt: new Date() } })
    .populate("user", "name profileImage")
    .sort({ createdAt: -1 });
  return {
    code: constant?.ResponseCode?.OK,
    message: "Stories fetch successfully",
    data: story,
  };
};

const CreateStory = async (currentUser, data) => {
  const { caption, media, mediaKey, type, text } = data;
  const now = new Date();
  const Story = new StoryScheme({
    user: currentUser?._id,
    ...(text && { text: text }),
    ...(!text && { media: { url: media, key: mediaKey, type: type } }),
    caption: caption,
    expiresAt: new Date(now.getTime() + constant?.STORY_TIME_EXPIRE),
    deletedAt: new Date(now.getTime() + constant?.STORY_DELETE_TIME),
  });
  await Story.save();
  return {
    code: constant?.ResponseCode?.CREATED,
    message: "Story Created Successfully",
    data: null,
  };
};

// Get News

const getLastMonthNews = async (type = "date") => {
  try {
    const sortBy = type === "trending" ? "socialScore" : "date";

    const requestBody = {
      action: "getArticles",
      keyword: [
        "Ola",
        "Uber",
        "ride-sharing",
        "petrol price",
        "diesel price",
        "fuel prices",
      ],
      keywordOper: "or",
      articlesPage: 1,
      articlesCount: 50,
      lang: "eng",
      articlesSortBy: sortBy,
      isDuplicateFilter: "skipDuplicates",
      articlesSortByAsc: false,
      dataType: ["news", "pr"],
      forceMaxDataTimeWindow: 31,
      resultType: "articles",
      apiKey: process.env.NEWS_API_KEY,
      includeArticleImage: true,
      includeArticleBasicInfo: true,
      includeSourceTitle: true,
      includeArticleBody: true,
      includeArticleSocialScore: true,
    };
    const response = await fetch(process.env.NEWS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw {
        code: response.status,
        message: "Failed to fetch news from API",
      };
    }

    const NewsData = await response.json();
    return {
      code: constant?.ResponseCode?.OK,
      message: "News Fetch successfully",
      data: NewsData,
    };
  } catch (error) {
    return {
      code: error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      message: error?.message || "Some things went wrongs!!",
      data: null,
    };
  }
};

module.exports = { getStory, CreateStory, getLastMonthNews };
