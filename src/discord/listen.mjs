import { Client, GatewayIntentBits, Events } from "discord.js";
import { messageInfo } from "./utils/message.mjs";
import { downloadImage } from "./utils/image.js";
import { compositeSoyjak } from "../sharp.mjs";

export function listen() {
  console.log("Listening for slash commands...");

  const client = new Client({
    intents: [
      // Listens to interactions
      GatewayIntentBits.Guilds,
      // Listens to messages
      GatewayIntentBits.GuildMessages,
      // Read message content (needs to be enabled @ Discord Developer Portal)
      // "Portal → Bot → Privileged Gateway Intents → Message Content Intent"
      GatewayIntentBits.MessageContent,
    ],
  });

  // Notifies when the bot is ready
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  // Listens for slash commands
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.commandName === "point") {
      await interaction.channel.send({
        files: ["dist/homestucka.jpeg"],
      });
    }
  });

  // Listen to all messages
  client.on(Events.MessageCreate, async (message) => {
    const { content, image, replied } = messageInfo(message);
    // TODO: allow original image as well as replied image
    if (content === "!point" && replied.image) {
      await downloadImage(replied.image);
      await compositeSoyjak("point", "temp.png");
      await message.channel.send({
        files: ["dist/new.png"],
      });
    }
  });

  // Logs in to Discord
  console.log("Logging in...");
  client.login(process.env.TOKEN);
}
