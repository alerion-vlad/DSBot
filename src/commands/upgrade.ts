import Discord from "discord.js";
import { upgrades } from "../data/commanders";
import stringSimilarity from "string-similarity";
import ability from "./ability";

const upgradeNames = upgrades.map((u) => u.name);

const upgrade = (message: Discord.Message, args: any) => {
  const bestMatch = stringSimilarity.findBestMatch(args.join(" "), upgradeNames)
    .bestMatch;
  if (bestMatch.rating <= 0.3) {
    return;
  }
  const upgrade = upgrades.find((u) => u.name === bestMatch.target);
  console.log(upgrade);

  if (!upgrade) {
    return;
  }

  const name = upgrade.name.replace(/ *\([^)]*\) */g, "");

  let description = upgrade.description;

  if (upgrade.requirements.length > 0) {
    description += `\n\n**Requires:** ${upgrade.requirements.join(", ")}`;
  }

  description += `\n\n**Cost:** ${upgrade.cost} Minerals`;

  const embed = new Discord.MessageEmbed()
    .setColor("2d2d2d")
    .addField(`**${name}** (${upgrade.commanders.join(", ")})`, description);

  message.channel.send(embed);
};

export default {
  name: "upgrade",
  description: "Displays info about speficied upgrade",
  aliases: ["upgrade", "upg"],
  execute: upgrade,
};
