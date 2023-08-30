import { Client, GatewayIntentBits, Events } from "discord.js";
import { commands } from "./commands/index.mjs";

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
    const command = message.content.match(/!(\w+)/)?.[1];

    // Find a command, in the commands object, that,
    // when converted to lowercase, matches the command name
    const commandFn = Object.entries(commands).find(
      ([name]) => name.toLowerCase() === command?.toLowerCase()
    )?.[1];

    // If there is a command, run it
    if (commandFn) {
      await commandFn(message);
    }
  });

  // Logs in to Discord
  console.log("Logging in...");
  client.login(process.env.TOKEN);
}
