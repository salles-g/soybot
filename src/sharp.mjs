import fs from "fs";
import sharp from "sharp";

const temp = "dist/temp.png";
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
  const background = image(source);
  const { width, height } = await background.metadata();

  const soyjakInst = image(soyjak).resize(width, height, {
    fit: "fill",
  });

  await soyjakInst.toBuffer().then((input) => {
    return background.composite([{ input }]).toFile(temp);
  });

  // Now we read the generated "temp" file and trim its borders
  await sharp(temp).trim().toFile(`dist/new.png`);

  // And finally, we delete the temp file and the source
  fs.unlinkSync(temp);
  fs.unlinkSync(path(source));

  return;
}
