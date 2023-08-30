import { compositeSoyjak } from "../../sharp.mjs";
import { downloadImage } from "../utils/image.js";
import { messageInfo } from "../utils/message.mjs";

export async function point(message) {
  const { image, replied } = messageInfo(message);

  // If there are no images at all, do nothing
  if (!image && !replied?.image) {
    return;
  }

  // Delete the message if it doesn't have an image
  if (!image) {
    message.delete();
  }

  // Download and composite the soyjak
  const { filename } = await downloadImage(replied?.image || image);
  const { filePath } = await compositeSoyjak("point", filename);

  // Reply to replied.id with the generated image
  if (replied.image) {
    await message.channel.messages.fetch(replied.id).then((msg) => {
      msg.reply({
        files: [filePath],
      });
    });
    return;
  }

  // Reply to the message with the generated image
  if (image) {
    await message.reply({
      files: [filePath],
    });
    return;
  }
}
