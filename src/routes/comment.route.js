const {
  ratting,
  getRatting,
  getComment,
  getAllRatting,
} = require("../controllers/comment.controller");

module.exports = (route) => {
  route.post("/comment/ratting", ratting);
  route.get("/comment/list-ratting/:product", getRatting);
  route.get("/comment/list-all-ratting", getAllRatting);
  route.get("/comment/list-comment/:product", getComment);
};
