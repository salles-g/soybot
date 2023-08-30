import fs from "fs";
import sharp from "sharp";

// Find any file in the "images" folder with temp.* filename
const findImg = (name) => {
  const files = fs.readdirSync("./images");
  return files.find((file) => file.startsWith(name));
};
const path = (name) => `./images/${name}`;
const image = (name) => sharp(path(name));
const soyMap = {
  point: "soyjak-pointing.png",
};

/**
 * Receives a background image and composites a soyjak pointing to it
 */
export async function compositeSoyjak(soyjak, source) {
  soyjak = soyMap[soyjak];
  source = findImg(source);
  const background = image(source);
  const { width, height } = await background.metadata();

  const soyjakInst = image(soyjak).resize(width, height, {
    fit: "fill",
  });

  await soyjakInst.toBuffer().then((input) => {
    return background.composite([{ input }]).toFile(source);
  });

  // Now we read the generated "temp" file and trim its borders
  const filePath = `dist/${source}`;
  await sharp(source).trim().toFile(filePath);

  // And finally, we delete the temp file and the source
  fs.unlinkSync(findImg(source));

  return { filePath };
}
