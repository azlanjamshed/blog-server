const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./auth/auth.routes");
const categoryRoutes = require("./category/category.routes");
const postRoutes = require("./post/post.routes");
const publicPostRoutes = require("./post/public-post.routes");
const {
  publicRouter: tagRoutes,
  adminRouter: adminTagRoutes,
} = require("./tag/tag.routes");
const uploadRoutes = require("./upload/upload.routes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", publicPostRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/admin/posts", postRoutes);
app.use("/api/admin/tags", adminTagRoutes);
app.use("/api/admin/upload", uploadRoutes);

module.exports = app;
