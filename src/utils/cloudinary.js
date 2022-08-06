const cloudinary = require("cloudinary");

module.exports = {
  uploadSingleWithBase64: async (imageUrl) => {
    return new Promise((resolve, reject) => {
      if (imageUrl.includes(";base64")) {
        cloudinary.v2.uploader.upload(imageUrl, {}, function (error, result) {
          if (error) reject(error);
          resolve(result.secure_url);
        });
      } else {
        resolve(imageUrl);
      }
    });
  },
  uploadSingle: async (filepath) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filepath, {}, function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  },
};
