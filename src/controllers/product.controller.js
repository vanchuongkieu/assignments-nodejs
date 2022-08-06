const ProductModel = require("../models/Product.model");
const slugify = require("slugify");
const CategoryModel = require("../models/Category.model");

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
  getProducts: async (req, res) => {
    try {
      const products = await ProductModel.find({}).populate("category").exec();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send("Lấy danh sách sản phẩm thất bại");
    }
  },
  getProductsSearch: async (req, res) => {
    try {
      const products = await ProductModel.find({
        name: { $regex: new RegExp(req.body.keyword), $options: "i" },
      }).exec();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send("Lấy danh sách sản phẩm thất bại");
    }
  },
  getProductsActive: async (req, res) => {
    try {
      const products = await ProductModel.find({ status: true }).exec();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send("Lấy danh sách sản phẩm thất bại");
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        _id: req.params.id,
      }).exec();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).send("Lấy sản phẩm thất bại");
    }
  },
  getProductByCategory: async (req, res) => {
    try {
      const category = await CategoryModel.findOne({
        name_ascii: req.params.ascii,
      }).exec();
      const product = await ProductModel.find({
        category: category._id,
      })
        .populate("category")
        .exec();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).send("Lấy sản phẩm thất bại");
    }
  },
  getProductByAscii: async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        name_ascii: req.params.ascii,
      })
        .populate(["category"])
        .exec();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).send("Lấy sản phẩm thất bại");
    }
  },
  getProductRelated: async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        name_ascii: req.params.ascii,
      }).exec();
      const products = await ProductModel.find({
        category: product.category,
        _id: { $ne: product._id },
      })
        .sort({ createdAt: 1 })
        .limit(5)
        .exec();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send("Lấy sản phẩm thất bại");
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name } = req.body;
      const product = await new ProductModel({
        ...req.body,
        name_ascii: slug(name),
      }).save();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).send("Thêm sản phẩm thất bại");
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name } = req.body;
      const product = await ProductModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
            name_ascii: slug(name),
          },
        },
        { new: true }
      ).exec();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).send("Cập nhật sản phẩm thất bại");
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await ProductModel.findOneAndDelete({
        _id: req.params.id,
      }).exec();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).send("Xoá sản phẩm thất bại");
    }
  },
  updateStatusProduct: async (req, res) => {
    try {
      const product = await ProductModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            status: !req.body.status,
          },
        },
        { new: true }
      )
        .populate("category")
        .exec();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).send("Cập nhật trạng thái thất bại");
    }
  },
  getHomeData: async (req, res) => {
    try {
      const productsCategories = await CategoryModel.aggregate([
        {
          $match: { status: true },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products",
            pipeline: [
              {
                $match: { status: true },
              },
              {
                $limit: 14,
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$products",
          },
        },
        {
          $group: {
            _id: "$_id",
            products: {
              $push: "$products",
            },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categories",
          },
        },
        {
          $unwind: {
            path: "$categories",
          },
        },
        {
          $addFields: {
            "categories.products": "$products",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$categories",
          },
        },
      ]).exec();

      res.status(200).json({
        productsCategories,
      });
    } catch (error) {
      res.status(500).send("Lấy dữ liệu thất bại");
    }
  },
};
