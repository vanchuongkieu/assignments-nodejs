const { cloudinarySingleUpload } = require("../controllers/upload.controller");

module.exports = (route) => {
  route.post("/upload/single-upload", cloudinarySingleUpload);
};
