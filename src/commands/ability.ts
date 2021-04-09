import Discord from "discord.js";
import { abilities } from "../data/commanders";
import stringSimilarity from "string-similarity";

const abilityNames = abilities.map((a) => a.name);

const ability = (message: Discord.Message, args: any) => {
  const bestMatch = stringSimilarity.findBestMatch(args.join(" "), abilityNames)
    .bestMatch;
  if (bestMatch.rating <= 0.3) {
    return;
  }
  const ability = abilities.find((a) => a.name === bestMatch.target);
  console.log(ability);

  if (!ability) {
    return;
  }

  const name = ability.name.replace(/ *\([^)]*\) */g, "");

  let abilityText = ability.description;
  if (ability.cooldown) {
    abilityText +=
      "\n\n" + `**Cooldown:** ${ability.cooldown.toString()} seconds`;
  }
  if (ability.duration) {
    abilityText += "\n\n" + `**Time:** ${ability.duration.toString()} seconds`;
  }
  if (ability.cost) {
    if (ability.cost.energy) {
      abilityText += `\n\n**Cost:** ${ability.cost.energy} Energy`;
    }
    if (ability.cost.life) {
      abilityText += `\n\n**Cost:** ${ability.cost.life} HP`;
    }
  }
  if (ability.requirements.length > 0) {
    abilityText += `\n\n**Requires:** ${ability.requirements.join(", ")}`;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("2d2d2d")
    .addField(`**${name}** (${ability.units.join(", ")})`, abilityText);

  message.channel.send(embed);
};

export default {
  name: "ability",
  description: "Displays info about specified ability",
  aliases: ["ability", "a", "abil", "spell"],
  execute: ability,
};
