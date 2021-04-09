import Discord from "discord.js";
import { drafts } from "./draft";
import { Commanders } from "../data/commanders";

const ban = (message: Discord.Message, args: any) => {
  if (!drafts.has(message.channel.id)) {
    console.log("No current draft.");
    return;
  }
  const draft = drafts.get(message.channel.id);
  if (!draft) {
    console.log("No current draft.");
    return;
  }
  const commander = Commanders.get(args[0].toLowerCase());
  if (!commander) {
    console.log("Invalid Commander");
    return;
  }
  draft.ban(message.author, commander);
  message.delete();
};

export default {
  name: "ban",
  description: "[Draft] Bans a commander",
  aliases: ["ban", "b"],
  execute: ban,
};
