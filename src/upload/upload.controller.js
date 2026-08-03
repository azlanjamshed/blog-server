const imagekit = require("../lib/imagekit");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await imagekit.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/blog/covers",
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      url: result.url,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};

module.exports = {
  uploadImage,
};
