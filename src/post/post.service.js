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
  tagIds,
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

  await validateTagIds(tagIds);

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
      ...(tagIds !== undefined && {
        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      }),
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
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
};

const getPublishedPosts = async ({ page, limit, tag }) => {
  const where = {
    status: "PUBLISHED",
    publishedAt: {
      not: null,
    },
    ...(tag && {
      tags: {
        some: {
          tag: { slug: tag },
        },
      },
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        readingTime: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: posts.map(({ tags, ...post }) => ({
      ...post,
      tags: tags.map(({ tag }) => tag),
    })),
    total,
  };
};

const getPublishedPostBySlug = async (slug) => {
  const post = await prisma.$transaction(async (tx) => {
    const { count } = await tx.post.updateMany({
      where: {
        slug,
        status: "PUBLISHED",
        publishedAt: {
          not: null,
        },
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    if (count === 0) {
      return null;
    }

    return tx.post.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        publishedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImageUrl: true,
        readingTime: true,
        views: true,
        metaTitle: true,
        metaDescription: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  });

  if (!post) {
    return null;
  }

  const { tags, ...postData } = post;
  return {
    ...postData,
    tags: tags.map(({ tag }) => tag),
  };
};

const getAllPosts = async () => {
  return prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      content: true,
      status: true,
      views: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
};

const updatePost = async (id, updates) => {
  const existingPost = await prisma.post.findUnique({
    where: { id },
  });

  if (!existingPost) {
    return null;
  }

  if (updates.categoryId && updates.categoryId !== existingPost.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: updates.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const { tagIds, ...data } = updates;

  await validateTagIds(tagIds);

  if (updates.title && updates.title !== existingPost.title) {
    const baseSlug = generateSlug(updates.title);
    let slug = baseSlug;
    let counter = 2;

    while (
      await prisma.post.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    data.slug = slug;
  }

  if (updates.content !== undefined) {
    data.readingTime = calculateReadingTime(updates.content);
  }

  if (updates.status === "PUBLISHED" && !existingPost.publishedAt) {
    data.publishedAt = new Date();
  }

  if (updates.status === "DRAFT") {
    data.publishedAt = null;
  }

  if (tagIds !== undefined) {
    data.tags = {
      deleteMany: {},
      create: tagIds.map((tagId) => ({
        tag: {
          connect: { id: tagId },
        },
      })),
    };
  }

  return prisma.post.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

const validateTagIds = async (tagIds) => {
  if (tagIds === undefined || tagIds.length === 0) {
    return;
  }

  const tagCount = await prisma.tag.count({
    where: {
      id: { in: tagIds },
    },
  });

  if (tagCount !== tagIds.length) {
    throw new Error("One or more tags were not found");
  }
};

const deletePost = async (id) => {
  try {
    return await prisma.post.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }

    throw error;
  }
};

module.exports = {
  createPost,
  getPublishedPosts,
  getPublishedPostBySlug,
  getAllPosts,
  updatePost,
  deletePost,
};
