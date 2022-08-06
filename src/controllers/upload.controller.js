const formidable = require("formidable");
const cloudinary = require("../utils/cloudinary");

module.exports = {
  cloudinarySingleUpload: (req, res) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      try {
        const image = await cloudinary.uploadSingle(files.image.filepath);
        res.status(201).json(image.secure_url);
      } catch (error) {
        res.status(500).send("Tải hình ảnh thất bại");
      }
    });
  },
};
