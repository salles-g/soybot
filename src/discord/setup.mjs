import { REST, Routes } from "discord.js";

export async function setup() {
  // This is the list of commands that the bot will have
  const commands = [];
  console.log("Setting up slash commands");

  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN
  );
  console.log("Token set:", `${process.env.TOKEN.slice(0, 6)}...`);

  try {
    console.log("Attempting to register slash commands");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );
  } catch (e) {
    console.error("Error while registering slash commands:", e);
  }
}
