import Discord from "discord.js";

export default {
  name: "invite",
  description: "Invite link and information for DSBot",
  aliases: ["invite", "inv", "link"],
  execute: async function (message: Discord.Message, args: any) {
    const Embed = new Discord.MessageEmbed()
      .setColor("2d2d2d")
      .setAuthor(
        "Invite Me",
        "",
        "https://discord.com/oauth2/authorize?client_id=823332970982146079&permissions=92224&scope=bot"
      )
      .addField(
        `**Direct Strike**`,
        "Invite me with the link above. \n Data Entry By: Heyrandompeople, Scintilla, Feralan"
      );
    await message.channel.send(Embed);
  },
};
