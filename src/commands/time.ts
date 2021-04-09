import Discord from "discord.js";

const TimeEmbed = new Discord.MessageEmbed()
  .setColor("2d2d2d")
  .addField(
    "**Starcraft II Time**",
    `Since Legacy of the Void, Starcraft II runs on the *Faster* game speed.\nThis means that every second of real time corresponds to 1.4 seconds of in game time. So, if an ability has a 60 second cooldown, it will take 60/1.4=~46 seconds of real time to come off cooldown.\nBlizzard and Tya try to have the cooldowns sync up with real time; unfortunately that doesn't always happen, and some cooldowns in game do not match the proper time.`
  );

const time = (message: Discord.Message, args: any) => {
  message.channel.send(TimeEmbed);
};

export default {
  name: "time",
  description: "Displays information about sc2 time.",
  aliases: ["time", "sc2time"],
  execute: time,
};
