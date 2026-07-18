const { z } = require("zod");

const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),

  content: z.string().trim().min(50, "Content must be at least 50 characters"),

  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt cannot exceed 300 characters")
    .optional(),

  coverImageUrl: z.string().url("Cover image must be a valid URL").optional(),

  categoryId: z.string().trim().min(1, "Category is required"),

  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

module.exports = {
  createPostSchema,
};
