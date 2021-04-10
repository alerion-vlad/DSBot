import Discord from "discord.js";
import { abilities, units, upgrades } from "../data/commanders";
import stringSimilarity from "string-similarity";

const unitNames = units.map((u) => u.name);

const targets = (types: Array<string>): string => {
  if (types.includes("Air") && types.includes("Ground")) {
    return "Air and Ground";
  }
  if (types.includes("Air")) {
    return "Air";
  }
  if (types.includes("Ground")) {
    return "Ground";
  }
  return "";
};

const unit = (message: Discord.Message, args: any) => {
  const bestMatch = stringSimilarity.findBestMatch(args.join(" "), unitNames)
    .bestMatch;
  if (bestMatch.rating <= 0.2) {
    return;
  }
  const unit = units.find((u) => u.name === bestMatch.target);

  if (!unit) {
    return;
  }

  console.log(unit);

  let upgradeCount = unit.commanders.includes("Tychus") ? 3 : 3;
  if (unit.name === "Dehaka") {
    upgradeCount = 0;
  }

  const name = unit.name.replace(/ *\([^)]*\) */g, "");

  let unitInfo = `**Tier:** ${unit.tier} \n **Cost:** ${unit.cost} Minerals \n **HP:** ${unit.life}`;
  if (unit.shields && unit.shields != 0) {
    unitInfo += `\n**Shields:** ${unit.shields.toString()}`;
  }
  if (unit.energy_max && unit.energy_start) {
    unitInfo += `\n**Energy:** ${unit.energy_start}/${unit.energy_max}`;
  }

  const armors = [unit.armor];
  for (let i = 1; i <= upgradeCount; i++) {
    armors.push(unit.armor + 1 * i);
  }
  unitInfo += `\n **Speed:** ${unit.speed}\n**Armor:** ${armors.join("/")}`;

  const weaponData = unit.weapons.map((weapon) => {
    let baseDamage = [weapon.damage.base];
    const baseLevel = weapon.level.base;
    for (let i = 1; i <= upgradeCount; i++) {
      baseDamage.push(weapon.damage.base + baseLevel * i);
    }
    let wp = `**${weapon.name}**`;
    wp += `\nDamage: ${baseDamage.join("/")} `;
    if (weapon.damage.versus) {
      const bonuses = [];
      for (const key in weapon.damage.versus) {
        //console.log(key);
        let baseDamage = [weapon.damage.versus[key]];
        let baseLevel = weapon.level.versus[key];
        for (let i = 1; i <= upgradeCount; i++) {
          baseDamage.push(weapon.damage.versus[key] + baseLevel * i);
        }
        bonuses.push(`${baseDamage.join("/")} vs ${key}`);
      }
      wp += ` (${bonuses.join(", ")})`;
    }
    if (weapon.count) {
      wp += `\n\nAttacks: ${weapon.count.toString()}`;
    } else {
      wp += "\n";
    }
    wp += `\nRange: ${
      weapon.range === 0 ? "Melee" : weapon.range
    }\nWeapon Speed: ${weapon.period}\nTargets: ${targets(weapon.targets)}\n`;
    return wp;
  });

  const abilityData = unit.abilities.map((abKey) => {
    const ability = abilities.find((ab) => ab.name === abKey);
    if (!ability) {
      return;
    }
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

  const upgradeData = unit.upgrades.map((uKey) => {
    const upgrade = upgrades.find((up) => up.name === uKey);
    //console.log(upgrade);
    if (!upgrade) {
      return;
    }
    let upOut = `**${upgrade.name.replace(/ *\([^)]*\) */g, "")} (${
      upgrade.cost.toString() ?? 0
    })**\n${upgrade.description}`;
    if (upgrade.requirements.length > 0) {
      upOut += `\nRequires: ${upgrade.requirements.join(", ")}`;
    }
    return upOut + "\n";
  });

  const embed = new Discord.MessageEmbed()
    .setColor("2d2d2d")
    .setTitle(`${name} (${unit.commanders.join(", ")})`)
    .setDescription(`*${unit.types.join(", ")}*`)
    .addField("__**Info**__", unitInfo);
  if (unit.weapons.length > 0) {
    embed.addField("__**Weapons**__", weaponData);
  }

  if (unit.abilities.length > 0) {
    if (unit.name === "Dehaka") {
      embed.addField("__**Abilities**__", abilityData.slice(0, 3));
      embed.addField("\u200b", abilityData[3]);
      embed.addField("\u200b", abilityData.slice(4, 11));
    }
    else if(unit.name === "Viper") {
      embed.addField("__**Abilities**__", abilityData.slice(0, 3));
      embed.addField("\u200b", abilityData[3]);
      embed.addField("\u200b", abilityData.slice(4,5));
    }
    else {
      embed.addField("__**Abilities**__", abilityData);
    }
  }

  if (unit.upgrades.length > 0) {
    embed.addField("__**Upgrades**__", upgradeData);
  }
  message.channel.send(embed);
};

export default {
  name: "unit",
  description: "Displays info about specified unit",
  aliases: ["unit", "un", "tower"],
  execute: unit,
};
