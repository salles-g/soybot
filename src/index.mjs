import { listen } from "./discord/listen.mjs";
import { setup } from "./discord/setup.mjs";
import dotenv from "dotenv";

(async () => {
  try {
    dotenv.config();
    await setup();
    listen();
  } catch {
    console.error("Failed to start bot");
  }
})();
