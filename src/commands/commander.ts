import Discord from "discord.js";
import {
  abilities,
  Commanders,
  commanderUpgrades,
  units,
  upgrades,
} from "../data/commanders";
import stringSimilarity from "string-similarity";

const commander = (message: Discord.Message, args: any) => {
  const bestMatch = stringSimilarity.findBestMatch(
    args.join(" "),
    Array.from(Commanders.keys())
  ).bestMatch;

  const commanderName = Commanders.get(bestMatch.target);

  if (!commanderName) {
    return;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("2d2d2d")
    .setTitle(`${commanderName} (Commander)`);

  const commanderUnits = units.filter((u) =>
    u.commanders.includes(commanderName)
  );
  const unitData: Array<{
    name: string;
    cost: number;
  }> = commanderUnits.map((u) => ({ name: u.name, cost: u.cost }));

  const commanderUpgrade = upgrades.filter((u) =>
    u.commanders.includes(commanderName)
  );
  const upgradeData: Array<{
    name: string;
    cost: number;
  }> = commanderUpgrade.map((u) => ({ name: u.name, cost: u.cost }));

  const commanderRaceData = commanderUpgrades.find(
    (c) => c.commander === commanderName
  );

  const cmdrAbilData = abilities.filter((a) =>
    a.units.includes(`Builder - ${commanderName}`)
  );

  if (!commanderRaceData) {
    return;
  }

  let stringBuilder = "```\n";
  commanderRaceData?.upgrades.forEach((upgrade) => {
    stringBuilder += `${upgrade.name} (${upgrade.cost})\n`;
  });
  stringBuilder += "```";
  embed.addField("**Upgrades**", stringBuilder);

  if (unitData.length > 0) {
    stringBuilder = "```\n";
    unitData.forEach((unit) => {
      stringBuilder += `${unit.name} (${unit.cost})\n`;
    });
    stringBuilder += "```";
    embed.addField("**Units**", stringBuilder);
  }

  if (upgradeData.length > 0) {
    stringBuilder = "```\n";
    upgradeData.forEach((upgrade) => {
      stringBuilder += `${upgrade.name} (${upgrade.cost})\n`;
    });
    stringBuilder += "```";
    embed.addField("**Upgrades**", stringBuilder);
  }

  if (cmdrAbilData.length > 0) {
    const abilityData = cmdrAbilData.map((ability) => {
      //console.log(ability);
      let abilOut = `**${ability.name.replace(/ *\([^)]*\) */g, "")}:** ${
        ability.description
      }`;
      const notes = [];
      if (ability.cooldown) {
        notes.push(`Cooldown: ${ability.cooldown.toString()} seconds `);
      }
      if (ability.requirements.length > 0) {
        notes.push(`Requires: ${ability.requirements.join(", ")} `);
      }
      if (ability.duration) {
        notes.push(`Time: ${ability.duration} `);
      }
      if (ability.cost?.energy) {
        notes.push(`${ability.cost.energy.toString()} Energy `);
      }
      if (ability.cost?.life) {
        notes.push(`${ability.cost.life.toString()} HP `);
      }
      if (notes.length > 0) {
        abilOut += `\n${notes.join("| ")}`;
      }

      return abilOut + "\n";
    });
    embed.addField("__**Abilities**__", abilityData);
  }

  message.channel.send(embed);
};

export default {
  name: "commander",
  description: "Displays info about specified unit",
  aliases: ["commander", "cmdr"],
  execute: commander,
};
