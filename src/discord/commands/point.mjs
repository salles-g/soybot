import { replyWithComposite } from "../utils/message.mjs";

export async function point(message) {
  await replyWithComposite(message, "point");
}
