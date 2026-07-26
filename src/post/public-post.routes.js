const express = require("express");
const {
  getPublishedPosts,
  getPublishedPostBySlug,
} = require("./post.controller");

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/:slug", getPublishedPostBySlug);

module.exports = router;
