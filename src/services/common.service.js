const { UTApi } = require("uploadthing/server");
const constant = require("../utils/constant");
const utapi = new UTApi();

const deleteImage = async (key) => {
  try {
    await utapi.deleteFiles(key);
    return {
      code: constant?.ResponseCode?.OK,
      message: "Image delete Successfully",
      data: null,
    };
  } catch (err) {
    return {
      code: err?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      message: err.message,
      data: err,
    };
  }
};

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

const SurgePriceCalculate = async (data) => {
  const { currentTime, distance, time } = data;
  // base price
  let price = 5.5 * distance + 2 * time;
  const hour = new Date(currentTime).getHours();
  let multiplier = 1;
  switch (true) {
    case hour >= 8 && hour < 11:
      multiplier = constant?.SURGE_MULTIPLIER?.EIGHTAM_ELEVENAM;
      break;

    case hour >= 6 && hour < 8:
      multiplier = constant?.SURGE_MULTIPLIER.MORNING_SIXAM_EIGHTAM;
      break;

    case hour >= 11 && hour < 14:
      multiplier = constant?.SURGE_MULTIPLIER.ELEVENAM_TWOPM;
      break;

    case hour >= 14 && hour < 16:
      multiplier = constant?.SURGE_MULTIPLIER.TWOPM_FOURPM;
      break;

    case hour >= 16 && hour < 20:
      multiplier = constant?.SURGE_MULTIPLIER.FOURPM_EIGHTPM;
      break;

    case hour >= 20 && hour < 22:
      multiplier = constant?.SURGE_MULTIPLIER.EIGHTPM_TENPM;
      break;

    case hour >= 22 || hour < 2:
      multiplier = constant?.SURGE_MULTIPLIER.TENPM_TWOAM;
      break;

    case hour >= 2 && hour < 6:
      multiplier = constant?.SURGE_MULTIPLIER.TWOAM_SIXAM;
      break;

    default:
      multiplier = 1;
  }

  const finalPrice = price * multiplier;

  return finalPrice;
};
module.exports = { deleteImage, SurgePriceCalculate };
