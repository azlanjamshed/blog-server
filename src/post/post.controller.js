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

module.exports = {
  createPost,
};
