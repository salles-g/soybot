const sharp = require("sharp");

const temp = "dist/temp.png";
const output = "dist/output.png";
const path = (name) => `./images/${name}`;
const image = (name) => sharp(path(name));

/**
 * Receives a background image and composites a soyjack pointing to it
 */
async function compositeSoyjack(bg) {
  const background = image(bg);
  const { width, height } = await background.metadata();

  const soyjak = image("soyjak-pointing.png").resize(width, height, {
    fit: "contain",
  });

  await soyjak.toBuffer().then((input) => {
    return background.composite([{ input }]).toFile(temp);
  });

  // Now we read the generated "temp" file and trim its borders
  await sharp(temp).trim().toFile(`dist/${bg}`);

  // And finally, we delete the temp file
  require("fs").unlinkSync(temp);
}

compositeSoyjack("leao.jpg");
