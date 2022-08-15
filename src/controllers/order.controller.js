const OrderModel = require("../models/Order.model");

module.exports = {
  userOrder: async (req, res) => {
    try {
      const order = await new OrderModel(req.body).save();
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json("Đặt hàng thất bại");
    }
  },
  listOrder: async (req, res) => {
    try {
      const orders = await OrderModel.find({}).exec();
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json("Lấy danh sách đặt hàng thất bại");
    }
  },
  filterOrder: async (req, res) => {
    try {
      const orders = await OrderModel.find({ status: req.body.status }).exec();
      res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json("Lấy danh sách đặt hàng thất bại");
    }
  },
  updateStatusOrder: async (req, res) => {
    try {
      const order = await OrderModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          ...req.body,
        },
        { $new: true }
      );
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json("Cập nhật thất bại");
    }
  },
};
