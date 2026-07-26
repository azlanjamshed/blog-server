const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} = require("./post.controller");
const { createPostSchema, updatePostSchema } = require("./post.validation");

router.get("/", requireAuth, getAllPosts);
router.post("/", requireAuth, validate(createPostSchema), createPost);
router.put("/:id", requireAuth, validate(updatePostSchema), updatePost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
