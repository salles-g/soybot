import { Message } from "discord.js";
import { downloadMedia, isImage } from "./image.js";
import { compositeSoyjak } from "../../composite.mjs";
import { isVideo } from "./video.js";

/**
 * @param {Message<boolean>} message
 */
export const messageInfo = (message) => {
  const content = message?.content;
  const image = message?.attachments.first()?.url;

  const repliedMsg = message?.channel.messages.cache.get(
    message?.reference?.messageId
  );
  const replied = {
    id: message?.reference?.messageId,
    content: repliedMsg?.content,
    image: repliedMsg?.attachments.first()?.url,
  };

  return { content, image, replied };
};

export const reply = async (message, content) => {
  const { replied } = messageInfo(message);
  // If the user is replying to a message, replied to that
  // with "It's over"
  if (replied.id) {
    // Delete the original message
    message.delete();
    // And reply to the replied message
    return await message.channel.messages
      .fetch(replied.id)
      .then((msg) => {
        msg.reply(content);
      });
  }

  // Else, reply to the original image
  await message.reply(content);
  return;
};
export const replyWithImage = async (message, image) => {
  return await reply(message, {
    files: [image],
  });
};

export const replyWithText = async (message, text) => {
  return await reply(message, text);
};

export const replyWithComposite = async (message, composite) => {
  const { image, replied } = messageInfo(message);
  const src = replied?.image || image;

  // If there are no images at all, do nothing
  if (!src) {
    return message.reply("You need to provide an image.");
  }

  if (!isImage(src) && !isVideo(src)) {
    return message.reply("That's not a valid media.");
  }

  // Delete the message if it doesn't have an image
  if (!image) {
    message.delete();
  }

  // Download and composite the given soyjak
  const { filename } = await downloadMedia(src);
  const { filePath } = await compositeSoyjak(composite, filename);

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
};
