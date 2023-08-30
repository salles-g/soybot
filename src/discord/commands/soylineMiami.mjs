import { replyWithImage } from "../utils/message.mjs";

export async function soylineMiami(message) {
  await replyWithImage(message, "images/soyline-miami.jpeg");
  return;
}
