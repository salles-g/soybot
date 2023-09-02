import { replyWithImage } from "../utils/message.mjs";

export async function avatar(message) {
  // Find the mentioned user's avatar, download it, and reply with it
  const user = message.mentions.users.first();

  // If there are no users mentioned, return the author's avatar
  if (!user) {
    const avatar = message.author.displayAvatarURL({
      format: "png",
      size: 1024,
    });
    return await replyWithImage(message, avatar);
  }

  // Else, return the mentioned user's avatar
  const avatar = user.displayAvatarURL({ format: "png", size: 1024 });
  return await replyWithImage(message, avatar);
}
