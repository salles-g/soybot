import { Message } from "discord.js";

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
