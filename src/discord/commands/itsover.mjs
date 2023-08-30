import { replyWithImage } from "../utils/message.mjs";

export async function itsOver(message) {
  await replyWithImage(message, "images/its-over.jpg");
  return;
}
