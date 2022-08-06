const {
  getProducts,
  getProductById,
  getProductByAscii,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatusProduct,
  getProductsActive,
  getProductsSearch,
  getProductByCategory,
  getHomeData,
  getProductRelated,
} = require("../controllers/product.controller");

module.exports = (app) => {
  app.get("/products", getProducts);
  app.post("/products/search-products", getProductsSearch);
  app.get("/products/home-data", getHomeData);
  app.get("/products/get-product-related/:ascii", getProductRelated);
  app.get("/products/find-products-active", getProductsActive);
  app.get("/products/find-product-by-id/:id", getProductById);
  app.get("/products/find-product-by-category/:ascii", getProductByCategory);
  app.get("/products/find-product-by-ascii/:ascii", getProductByAscii);
  app.put("/products/update-product/:id", updateProduct);
  app.put("/products/update-status-product/:id", updateStatusProduct);
  app.post("/products/create-product", createProduct);
  app.delete("/products/delete-product/:id", deleteProduct);
};
