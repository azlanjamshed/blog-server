const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const { uploadImage } = require("./upload.controller");
const uploadErrorHandler = require("../middleware/uploadError.middleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  uploadErrorHandler,
  uploadImage,
);

module.exports = router;
