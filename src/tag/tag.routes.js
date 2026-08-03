const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { getAllTags, createTag } = require("./tag.controller");

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get("/", getAllTags);
adminRouter.post("/", requireAuth, createTag);

module.exports = {
  publicRouter,
  adminRouter,
};
