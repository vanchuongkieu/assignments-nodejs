const {
  getCategories,
  getCategoryById,
  getCategoryByAscii,
  getCategoryProductsByAscii,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesActive,
  updateStatusCategory,
} = require("../controllers/category.controller");

module.exports = (app) => {
  app.get("/categories", getCategories);
  app.get("/categories/find-categories-active", getCategoriesActive);
  app.get("/categories/find-category-by-id/:id", getCategoryById);
  app.get("/categories/find-all-products/:ascii", getCategoryProductsByAscii);
  app.get("/categories/find-category-by-ascii/:ascii", getCategoryByAscii);
  app.put("/categories/update-category/:id", updateCategory);
  app.post("/categories/create-category", createCategory);
  app.delete("/categories/delete-category/:id", deleteCategory);
  app.put("/categories/update-status-category/:id", updateStatusCategory);
};
