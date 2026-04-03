const ResponseCode = {
  OK: 200,
  ALREADY_EXIST: 208,
  CREATED: 201,
  ACCEPTED: 202,
  NOCONTENT: 204,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUEST: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const TIME_INTERVAL_NOTIFICATIONS = 10 * 1000;

const STORY_TIME_EXPIRE = 24 * 60 * 60 * 1000;
const STORY_DELETE_TIME = (24 * 60 * 60 + 10 * 60) * 1000;

const SURGE_MULTIPLIER = Object.freeze({
  EIGHTAM_ELEVENAM: 1.7,
  MORNING_SIXAM_EIGHTAM: 1.3,
  ELEVENAM_TWOPM: 1.25,
  TWOPM_FOURPM: 1.45,
  FOURPM_EIGHTPM: 1.84,
  EIGHTPM_TENPM: 1.55,
  TENPM_TWOAM: 2.4,
  TWOAM_SIXAM: 1.45,
});

const VEHICLE_MULTIPLIER = Object.freeze({
  BIKE: 1.1,
  CARXL: 1.35,
  AUTO: 1.25,
  CARXXL: 1.5,
  LUXURYXL: 1.7,
  LUXURYXXL: 1.9,
});

const VEHICLE_CONFIG = [
  { key: "BIKE", type: "Bike", capacity: 1, arrivalTime: "3min" },
  { key: "AUTO", type: "Auto", capacity: 3, arrivalTime: "2min" },
  { key: "CARXL", type: "Uber XL", capacity: 4, arrivalTime: "5min" },
  { key: "CARXXL", type: "Uber XXL", capacity: 6, arrivalTime: "1min" },
  // { key: "LUXURYXL", type: "Uber Luxury XL", capacity: 4, arrivalTime: "3min" },
  // {
  //   key: "LUXURYXXL",
  //   type: "Uber Luxury XXL",
  //   capacity: 6,
  //   arrivalTime: "4min",
  // },
];


module.exports = {
  ResponseCode,
  TIME_INTERVAL_NOTIFICATIONS,
  STORY_TIME_EXPIRE,
  STORY_DELETE_TIME,
  SURGE_MULTIPLIER,
  VEHICLE_MULTIPLIER,
  VEHICLE_CONFIG,
};
