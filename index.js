const sharp = require("sharp");

const temp = "dist/temp.png";
const path = (name) => `./images/${name}`;
const image = (name) => sharp(path(name));

/**
 * Receives a background image and composites a soyjack pointing to it
 */
async function compositeSoyjak(soyjak, source) {
  const background = image(source);
  const { width, height } = await background.metadata();

  const soyjakInst = image(soyjak).resize(width, height, {
    fit: "contain",
  });

  await soyjakInst.toBuffer().then((input) => {
    return background.composite([{ input }]).toFile(temp);
  });

  // Now we read the generated "temp" file and trim its borders
  await sharp(temp).trim().toFile(`dist/${source}`);

  // And finally, we delete the temp file
  require("fs").unlinkSync(temp);
}

compositeSoyjak("soyjak-pointing.png", "switch.jpg");
