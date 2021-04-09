import Discord from "discord.js";

const TimeEmbed = new Discord.MessageEmbed()
  .setColor("2d2d2d")
  .addField(
    "**Attack Speed**",
    "SC2 Attack Period can be calculated by the following formula: ```base/(1+1-(1/(1+percent)^stacks))```\n Usage: ```period <base> <percentage> <stack count>```"
  );

export function attackSpeedAdd(
  base: number,
  percent: number,
  stacks: number
): number {
  return base / (1 + (1 - 1 / Math.pow(1 + percent, stacks)));
}

export function round(value: any, decimals: any): number {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

const attackspeed = (message: Discord.Message, args: any) => {
  if (args.length < 3) {
    message.channel.send(TimeEmbed);
    return;
  }
  const newPeriod = attackSpeedAdd(
    parseFloat(args[0]),
    parseFloat(args[1]),
    parseFloat(args[2])
  );
  const embed = new Discord.MessageEmbed()
    .setColor("2d2d2d")
    .addField(
      "**Attack Speed**",
      `**Base:** ${args[0]}\n**Buff:** ${args[1]}\n**Stacks: ** ${args[2]}\n` +
        "```= " +
        round(newPeriod, 2).toString() +
        "```"
    );
  message.channel.send(embed);
};

export default {
  name: "attackspeed",
  description: "Calculates an attack speed buff for a unit.",
  aliases: ["attackspeed", "as", "period"],
  execute: attackspeed,
};
