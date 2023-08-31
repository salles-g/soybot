const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

/**
 * @param {string} url
 * @returns {boolean}
 */
const isImage = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png|jfif|webp)$/) != null;
};

/**
 * Download a media from given URL and save it to the dist/ folder
 * @param {string} url
 */
const downloadMedia = async (url) => {
  console.log("Downloading media from URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    console.log("Failed to download media from URL:", url);
    throw new Error(`unexpected response ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  const extension = contentType.split("/")[1];
  const filename = `temp.${extension}`;

  await streamPipeline(
    response.body,
    fs.createWriteStream(path.resolve("images", filename))
  );
  return { filename };
};

module.exports = {
  isImage,
  downloadMedia,
};
