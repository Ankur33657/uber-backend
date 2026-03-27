const { createUploadthing } = require("uploadthing/express");

const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
  }),
};

module.exports = { uploadRouter };
