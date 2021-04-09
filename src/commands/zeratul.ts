import Discord from "discord.js";

const ZeratulEmbed = new Discord.MessageEmbed()
  .setColor("2d2d2d")
  .addField(
    "**Zeratul**",
    "```I think people just want Zeratul for the completeness factor, which is a fine reason to want him, but I think people would regret it if I added him...\n\nMy complaint with Zeratul has always been that he's like half a commander.\n\nI have been considering inverting his legion mechanic, but I'm not there yet.\n-Tya```"
  );

const zeratul = (message: Discord.Message, args: any) => {
  message.channel.send(ZeratulEmbed);
};

export default {
  name: "Zeratul",
  description: "Talks about Zeratul.",
  aliases: ["zeratul"],
  execute: zeratul,
};
