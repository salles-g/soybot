import { compositeSoyjak } from "../../sharp.mjs";
import { downloadImage } from "../utils/image.js";
import { messageInfo } from "../utils/message.mjs";

export async function point(message) {
  const { image, replied } = messageInfo(message);

  // If there are no images at all, do nothing
  if (!image && !replied) {
    return;
  }

  // Delete the message if it doesn't have an image
  if (!image) {
    message.delete();
  }

  // If the user is replying to an image, soyjakify it
  if (replied.image) {
    await downloadImage(replied.image);
    await compositeSoyjak("point", "temp.png");
    // Reply to replied.id with the generated image
    await message.channel.messages.fetch(replied.id).then((msg) => {
      msg.reply({
        files: ["dist/new.png"],
      });
    });
    return;
  }

  // If the user is sending an image, soyjakify that instead
  if (image) {
    await downloadImage(image);
    await compositeSoyjak("point", "temp.png");
    // Reply to the message with the generated image
    await message.reply({
      files: ["dist/new.png"],
    });
    return;
  }
}
