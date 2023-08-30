import { messageInfo } from "../utils/message.mjs";

export async function itsOver(message) {
  const { replied } = messageInfo(message);

  // If the user is replying to a message, replied to that
  // with "It's over"
  if (replied.id) {
    // Delete the original message
    message.delete();
    // And reply to the replied message
    await message.channel.messages.fetch(replied.id).then((msg) => {
      msg.reply({
        files: ["images/its-over.jpg"],
      });
    });
    return;
  }

  // Else, reply to the original image
  await message.reply({
    files: ["images/its-over.jpg"],
  });
}
