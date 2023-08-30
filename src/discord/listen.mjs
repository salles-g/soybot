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
    if (content !== "!point") {
      return;
    }

    // Delete the message if it doesn't have an image
    if (!image) {
      message.delete();
    }

    if (replied.image) {
      await downloadImage(replied.image);
      await compositeSoyjak("point", "temp.png");
      // Reply to replied.id with the generated image
      await message.channel.messages.fetch(replied.id).then((msg) => {
        msg.reply({
          files: ["dist/new.png"],
        });
      });
      return;
    }

    if (image) {
      await downloadImage(image);
      await compositeSoyjak("point", "temp.png");
      // Reply to the message with the generated image
      await message.reply({
        files: ["dist/new.png"],
      });
      return;
    }
  });

  // Logs in to Discord
  console.log("Logging in...");
  client.login(process.env.TOKEN);
}
