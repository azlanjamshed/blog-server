const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const { createPost } = require("./post.controller");
const { createPostSchema } = require("./post.validation");

router.post("/", requireAuth, validate(createPostSchema), createPost);

module.exports = router;
