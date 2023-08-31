import { replyWithComposite } from "../utils/message.mjs";

export async function itsOverLay(message) {
  await replyWithComposite(message, "its-over");
}
