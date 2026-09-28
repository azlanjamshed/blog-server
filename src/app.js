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
const allowedOrigins = [
  process.env.USER_URL,
  process.env.ADMIN_URL, // Admin
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, mobile apps, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

const requireAuth = require("./middleware/auth.middleware");
const router = require("./auth/auth.routes");

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", publicPostRoutes);
app.use("/api/tags", tagRoutes);

// Auth-protected author & admin router
const authorRouter = express.Router();
authorRouter.use(requireAuth);
authorRouter.get("/me", (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});
authorRouter.use("/posts", postRoutes);
authorRouter.use("/tags", adminTagRoutes);
authorRouter.use("/upload", uploadRoutes);

// Available as both /api/author and /api/admin for full compatibility
app.use("/api/author", authorRouter);
app.use("/api/admin", authorRouter);



module.exports = app;
