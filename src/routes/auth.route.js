const { login, register } = require("../controllers/auth.controller");

module.exports = (route) => {
  route.post("/auth/login", login);
  route.post("/auth/register", register);
};
