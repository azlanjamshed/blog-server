const { z } = require("zod");

const tagIdsSchema = z
  .array(z.string().trim().min(1, "Tag ID cannot be empty"))
  .refine((tagIds) => new Set(tagIds).size === tagIds.length, {
    message: "Tag IDs must be unique",
  });

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

  tagIds: tagIdsSchema.optional(),
});

const updatePostSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(150).optional(),
    content: z
      .string()
      .trim()
      .min(50, "Content must be at least 50 characters")
      .optional(),
    excerpt: z
      .string()
      .trim()
      .max(300, "Excerpt cannot exceed 300 characters")
      .nullable()
      .optional(),
    coverImageUrl: z
      .string()
      .url("Cover image must be a valid URL")
      .nullable()
      .optional(),
    categoryId: z.string().trim().min(1, "Category is required").optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    metaTitle: z.string().trim().max(150).nullable().optional(),
    metaDescription: z.string().trim().max(300).nullable().optional(),
    tagIds: tagIdsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

module.exports = {
  createPostSchema,
  updatePostSchema,
};
