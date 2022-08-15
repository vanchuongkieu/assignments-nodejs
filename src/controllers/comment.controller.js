const CommentModel = require("../models/Comment.model");
const ProductModel = require("../models/Product.model");

module.exports = {
  ratting: async (req, res) => {
    try {
      const comment = await new CommentModel(req.body).save();
      res.status(201).json(comment);
    } catch (error) {
      console.log(error);
      res.status(500).json("Đánh giá thất bại");
    }
  },
  getRatting: async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        name_ascii: req.params.product,
      }).exec();
      const comments = await CommentModel.find({
        rate: { $gt: 0 },
        product: product._id,
      }).exec();

      let count = 0;
      let sum = 0;
      const commentsCount = [];
      for (let i = 1; i <= 5; i++) {
        const totalStar = comments.filter((x) => x.rate == i).length;
        commentsCount.push(totalStar);
      }
      commentsCount.forEach(function (value, index) {
        count += value;
        sum += value * (index + 1);
      });

      const commentTotal = {
        middle: Number((sum / count).toFixed(1)) || 0,
        count: comments.length,
        comments: commentsCount,
      };
      res.status(200).json({ comments, commentTotal });
    } catch (error) {
      res.status(500).json("Lấy danh sách đánh giá thất bại");
    }
  },
  getAllRatting: async (req, res) => {
    try {
      const comments = await CommentModel.find({
        rate: { $gt: 0 },
      }).exec();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json("Lấy danh sách đánh giá thất bại");
    }
  },
  getComment: async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        name_ascii: req.params.product,
      }).exec();
      const comments = await CommentModel.find({
        rate: 0,
        product: product._id,
      }).exec();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json("Lấy danh hỏi đáp thất bại");
    }
  },
};
