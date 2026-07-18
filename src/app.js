const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./auth/auth.routes");
const categoryRoutes = require("./category/category.routes");
const postRoutes = require("./post/post.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/posts", postRoutes);

module.exports = app;
