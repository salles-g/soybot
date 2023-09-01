import fs from "fs";
import sharp from "sharp";
import {
  addWatermark,
  getFirstFrame,
  isVideo,
} from "./discord/utils/video.js";
import { isImage } from "./discord/utils/image.js";

// Find any file in the "images" folder with temp.* filename
const findImg = (name) => {
  const files = fs.readdirSync("public/assets");
  return files.find((file) => file.startsWith(name));
};
const path = (name) => `public/assets/${name}`;
const image = (name) => sharp(path(name));
const soyMap = {
  point: "soyjak-pointing.png",
  "its-over": "itsovertransparent.png",
};

/**
 * @param {string} source
 * @param {number} width
 * @param {number} height
 * @returns {sharp.Sharp} Sharp image instance
 */
function resizeImage(source, width, height) {
  return image(source).resize(width, height, {
    fit: "fill",
  });
}

/**
 * Fit image to target's size
 * @param {string} source Path to the source image
 * @param {sharp.Sharp} target Sharp image instance
 */
async function fitImageToAnother(source, target) {
  const { width, height } = await target.metadata();
  return resizeImage(source, width, height);
}

async function compositeImage(source, soyjak) {
  const background = image(source);
  const resizedSoyjak = await fitImageToAnother(soyjak, background);

  const soyjakBuffer = await resizedSoyjak.toBuffer();
  const composite = background.composite([{ input: soyjakBuffer }]);

  const filePath = `dist/${source}`;
  await composite.trim().toFile(filePath);

  // Delete the source image after it's been composited
  fs.unlinkSync(path(source));

  return { filePath };
}

async function compositeVideo(source, soyjak) {
  // Get first frame of the video
  const { thumbnail } = await getFirstFrame(source);

  if (!thumbnail) {
    return console.log("Failed to get thumbnail from", source);
  }

  // Fit the soyjak to the thumbnail
  const resizedSoyjak = await fitImageToAnother(
    soyjak,
    sharp(thumbnail)
  );
  // Write resized to "dist/resized.png"
  await resizedSoyjak.toFile("dist/resized.png");

  const { watermarkedVideoPath } = await addWatermark(
    "dist/resized.png",
    source
  );
  return { filePath: watermarkedVideoPath };
}

/**
 * Receives a background image and composites a soyjak pointing to it
 */
export async function compositeSoyjak(soyjak, source) {
  soyjak = soyMap[soyjak];
  source = findImg(source);

  if (isVideo(source)) {
    return await compositeVideo(source, soyjak);
  } else if (isImage(source)) {
    return await compositeImage(source, soyjak);
  }

  throw new Error("Invalid media type");
}
