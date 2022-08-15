const ProductModel = require("../models/Product.model");
const CategoryModel = require("../models/Category.model");
const slugify = require("slugify");

const slug = (value) =>
  slugify(value, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
  });

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await CategoryModel.find({}).exec();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).send("Lấy danh sách danh mục thất bại");
    }
  },
  getCategoriesActive: async (req, res) => {
    try {
      const categories = await CategoryModel.find({ status: true }).exec();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).send("Lấy danh sách danh mục thất bại");
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await CategoryModel.findOne({
        _id: req.params.id,
      }).exec();
      res.status(200).json(category);
    } catch (error) {
      res.status(500).send("Lấy danh mục thất bại");
    }
  },
  getCategoryByAscii: async (req, res) => {
    try {
      const category = await CategoryModel.findOne({
        name_ascii: req.params.ascii,
      }).exec();
      const products = await ProductModel.find({ category: category._id })
        .populate("author")
        .exec();
      res.status(200).json({
        category,
        products,
      });
    } catch (error) {
      res.status(500).send("Lấy danh mục thất bại");
    }
  },
  getCategoryProductsByAscii: async (req, res) => {
    try {
      const category = await CategoryModel.findOne({
        name_ascii: req.params.ascii,
      }).exec();
      const products = await ProductModel.find({
        category: category._id,
      })
        .populate(["category"])
        .exec();
      res.status(200).json({
        category,
        products,
      });
    } catch (error) {
      res.status(500).send("Lấy danh sách sản phẩm theo danh mục thất bại");
    }
  },
  createCategory: async (req, res) => {
    try {
      const category = await new CategoryModel({
        ...req.body,
        name_ascii: slugify(req.body.name).toLowerCase(),
      }).save();
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).send("Thêm danh mục thất bại");
    }
  },
  updateCategory: async (req, res) => {
    try {
      const category = await CategoryModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        },
        { new: true }
      ).exec();
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).send("Cập nhật danh mục thất bại");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await ProductModel.find({
        category: req.params.id,
      }).countDocuments();
      if (products > 0) {
        return res.status(500).send("Danh mục hiện vẫn còn sản phẩm");
      }
      const category = await CategoryModel.findOneAndDelete({
        _id: req.params.id,
      }).exec();
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).send("Xoá danh mục thất bại");
    }
  },
  updateStatusCategory: async (req, res) => {
    console.log(req.body.status);
    try {
      const category = await CategoryModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: !req.body.status,
          },
        },
        { new: true }
      ).exec();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).send("Cập nhật trạng thái thất bại");
    }
  },
};
