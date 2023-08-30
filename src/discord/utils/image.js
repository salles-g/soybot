const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

/**
 * Download an image from given URL and save it to the dist/ folder
 * @param {string} url
 */
const downloadImage = async (url) => {
  console.log("Downloading image from URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    console.log("Failed to download image from URL:", url);
    throw new Error(`unexpected response ${response.statusText}`);
  }
  await streamPipeline(
    response.body,
    fs.createWriteStream(path.resolve("images", "temp.png"))
  );
  return;
};

module.exports = {
  downloadImage,
};
