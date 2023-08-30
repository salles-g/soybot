import { Client, GatewayIntentBits } from "discord.js";

export function listen() {
  console.log("Listening for slash commands...");

  const client = new Client({
    intents: [
      // Listens to interactions
      GatewayIntentBits.Guilds,
      // Listens to messages
      GatewayIntentBits.GuildMessages,
    ],
  });

  // Notifies when the bot is ready
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  // Listens for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.commandName === "point") {
      await interaction.reply(
        `Soyjak points at ${interaction.user.username}`
      );
    }
  });

  // Listen to all messages
  client.on("messageCreate", async (message) => {
    console.log("Message:", message);
    console.log("Content:", message.content);
  });

  // Logs in to Discord
  console.log("Logging in...");
  client.login(process.env.TOKEN);
}
