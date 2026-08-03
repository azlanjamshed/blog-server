const prisma = require("../lib/prisma");
const generateSlug = require("../utils/slugify");

const getAllTags = async () => {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const createTag = async (name) => {
  const slug = generateSlug(name);
  const existingTag = await prisma.tag.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existingTag) {
    throw new Error("Tag already exists");
  }

  return prisma.tag.create({
    data: {
      name,
      slug,
    },
  });
};

module.exports = {
  getAllTags,
  createTag,
};
