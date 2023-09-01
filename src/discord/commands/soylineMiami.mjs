import { replyWithImage } from "../utils/message.mjs";

export async function soylineMiami(message) {
  await replyWithImage(message, "public/assets/soyline-miami.jpeg");
  return;
}
