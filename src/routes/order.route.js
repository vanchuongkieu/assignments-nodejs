const {
  userOrder,
  listOrder,
  updateStatusOrder,
  filterOrder,
} = require("../controllers/order.controller");

module.exports = (route) => {
  route.post("/order/user-order", userOrder);
  route.post("/order/filter-order", filterOrder);
  route.put("/order/update-status-order/:id", updateStatusOrder);
  route.get("/order/list-order", listOrder);
};
