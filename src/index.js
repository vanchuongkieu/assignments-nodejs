const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary");

const app = express();

app.use(morgan("tiny"));
app.use(express.json({ limit: "50mb" }));
dotenv.config({ path: __dirname + "/configs/setting.env" });

app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let mongodbConnectURL = "";

if (process.env.NODE_ENV == "production") {
  mongodbConnectURL = process.env.MONGODB_ONLINE;
} else {
  mongodbConnectURL = process.env.MONGODB_OFFLINE;
}

mongoose
  .connect(mongodbConnectURL)
  .then(() => console.log("MONGODB connected successfully"))
  .catch((error) => console.log(error));

const routePath = __dirname + "/routes/";

fs.readdirSync(routePath).forEach(function (file) {
  const route = routePath + file;
  require(route)(app);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
