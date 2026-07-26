const postService = require("./post.service");

const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImageUrl, categoryId, status } =
      req.body;

    const post = await postService.createPost({
      title,
      content,
      excerpt,
      coverImageUrl,
      categoryId,
      status,
      authorId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getPublishedPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "page must be a positive integer and limit must be between 1 and 100",
      });
    }

    const { posts, total } = await postService.getPublishedPosts({
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPublishedPostBySlug = async (req, res, next) => {
  try {
    const post = await postService.getPublishedPostBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        ...post,
        tags: post.tags.map(({ tag }) => tag),
      },
    });
  } catch (error) {
    if (error.message === "Category not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await postService.deletePost(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
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
