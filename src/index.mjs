import { listen } from "./discord/listen.mjs";
import { setup } from "./discord/setup.mjs";
import dotenv from "dotenv";

dotenv.config();
await setup();
listen();
