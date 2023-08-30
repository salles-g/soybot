import { replyWithText } from "../utils/message.mjs";

export async function dancejak(message) {
  await replyWithText(
    message,
    "https://cdn.discordapp.com/attachments/819412031412109333/1146530339838242919/dancejak.gif"
  );
  return;
}
