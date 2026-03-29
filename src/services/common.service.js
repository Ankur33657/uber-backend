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
module.exports = { deleteImage };
