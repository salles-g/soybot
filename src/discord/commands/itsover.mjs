import { replyWithImage } from "../utils/message.mjs";

export async function itsOver(message) {
  await replyWithImage(message, "public/assets/its-over.jpg");
  return;
}
