const calculateReadingTime = (content) => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

module.exports = calculateReadingTime;
