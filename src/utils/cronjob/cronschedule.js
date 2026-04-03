const cron = require("node-cron");
const CronServices = require("./cron.services");
cron.schedule("0 0 * * *", CronServices?.DeleteStory);
