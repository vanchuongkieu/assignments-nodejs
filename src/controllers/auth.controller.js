const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email }).exec();
      if (!user) {
        return res.status(400).send("Không tìm thấy tài khoản");
      }
      if (!user.authenticate(password)) {
        return res.status(400).send("Mật khẩu không chính xác");
      }

      const accessToken = jwt.sign({ _id: user._id }, "MOBILE_TOKEN", {
        expiresIn: "1d",
      });
      const refreshToken = jwt.sign({ _id: user._id }, "MOBILE_REFRESH_TOKEN", {
        expiresIn: "365d",
      });

      const currentUser = await UserModel.findOne({ _id: user._id })
        .select("-password")
        .select("-salt")
        .exec();

      if (!currentUser.status) {
        return res.status(500).send("Tài khoản đã bị khóa");
      }

      return res.status(200).json({
        accessToken,
        refreshToken,
        user: currentUser,
      });
    } catch (error) {
      return res.status(500).send("Đăng nhập thất bại");
    }
  },
  register: async (req, res) => {
    try {
      const { email, phone, name, password } = req.body;
      const emailExist = await UserModel.findOne({ email }).exec();
      const phoneExist = await UserModel.findOne({ phone }).exec();
      if (emailExist) {
        return res.status(400).send("Địa chỉ email đã tồn tại");
      }
      if (phoneExist) {
        return res.status(400).send("Số điện thoại đã tồn tại");
      }
      const user = await new UserModel({ email, name, phone, password }).save();

      const currentUser = await UserModel.findOne({ _id: user._id })
        .select("-password")
        .select("-salt")
        .exec();

      return res.status(201).json(currentUser);
    } catch (error) {
      return res.status(500).send("Đăng ký thất bại");
    }
  },
};
