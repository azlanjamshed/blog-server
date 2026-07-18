const prisma = require("../lib/prisma");
const generateSlug = require("../utils/slugify");
const calculateReadingTime = require("../utils/calculateReadingTime");

const createPost = async ({
  title,
  content,
  excerpt,
  coverImageUrl,
  categoryId,
  status = "DRAFT",
  authorId,
}) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Generate unique slug
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 2;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(content);

  // Set publishedAt only if published
  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  // Create post
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImageUrl,
      status,
      readingTime,
      publishedAt,
      authorId,
      categoryId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });

  return post;
};

module.exports = {
  createPost,
};
