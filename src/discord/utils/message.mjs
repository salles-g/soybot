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
