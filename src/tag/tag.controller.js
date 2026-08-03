const tagService = require("./tag.service");

const getAllTags = async (req, res, next) => {
  try {
    const tags = await tagService.getAllTags();

    return res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tag = await tagService.createTag(name.trim());

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tag,
    });
  } catch (error) {
    if (error.message === "Tag already exists") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  getAllTags,
  createTag,
};
