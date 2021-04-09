import Discord from "discord.js";
import { drafts } from "./draft";

const quit = (message: Discord.Message, args: any) => {
  if (!drafts.has(message.channel.id)) {
    console.log("No current draft.");
    return;
  }
  const draft = drafts.get(message.channel.id);
  if (!draft) {
    console.log("No current draft.");
    return;
  }
  draft.cancel(message.author);
};

export default {
  name: "quit",
  description: "[Draft] Quits Draft",
  aliases: ["quit", "q", "exit", "leave", "cancel"],
  execute: quit,
};
