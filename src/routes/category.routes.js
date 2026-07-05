const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");

const {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/", requireAuth, createCategory);
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", requireAuth, updateCategory);
router.delete("/:id", requireAuth, deleteCategory);

module.exports = router;
