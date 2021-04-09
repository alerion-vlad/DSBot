import Discord, { TextChannel } from "discord.js";
import { getUser } from "../utils/user";

const DraftPhase = {
  CM_BanP1: "CM_BanP1",
  CM_BanP2: "CM_BanP2",
  CM_PickP1: "CM_PickP1",
  CM_PickP2: "CM_PickP2",
  CM_PickP3: "CM_PickP3",
  CM_BanP3: "CM_BanP3",
  CM_BanP4: "CM_BanP4",
  CM_PickP4: "CM_PickP4",
  CM_PickP5: "CM_PickP5",
  CM_Complete: "CM_Complete",
};
type DraftPhase = typeof DraftPhase[keyof typeof DraftPhase];

export const drafts: Map<string, Draft> = new Map();

const InvalidMessage = new Discord.MessageEmbed()
  .setColor("2d2d2d")
  .addField("**To start a draft...**", "```draft @<captain1> @<captain2>```");

const CaptainMessage = new Discord.MessageEmbed()
  .setColor("2d2d2d")
  .addField("**Error**", "```Captains must be different users!```");

const draft = (message: Discord.Message, args: any) => {
  if (drafts.has(message.channel.id)) {
    console.log("Cannot create Draft in this channel.");
    return;
  }

  const Captain1 = getUser(args[0]);
  const Captain2 = getUser(args[1]);

  if (!Captain1 || !Captain2) {
    message.channel.send(InvalidMessage);
    return;
  }
  if (!message.channel.isText()) {
    return;
  }
  if (Captain1 === Captain2) {
    message.channel.send(CaptainMessage);
    return;
  }

  if (Captain1 !== message.author && Captain2 !== message.author) {
    return;
  }

  console.log("Starting Draft...");
  drafts.set(
    message.channel.id,
    new Draft(message.channel as TextChannel, Captain1, Captain2)
  );
};

export default {
  name: "draft",
  description: "Starts a new Commanders Draft",
  aliases: ["draft", "d", "newgame", "newdraft", "start"],
  execute: draft,
};

const phase_name = (phase: DraftPhase): string | undefined => {
  if (
    [
      DraftPhase.CM_BanP1,
      DraftPhase.CM_BanP2,
      DraftPhase.CM_BanP3,
      DraftPhase.CM_BanP4,
    ].includes(phase)
  ) {
    return "Ban";
  }
  if (
    [
      DraftPhase.CM_PickP1,
      DraftPhase.CM_PickP2,
      DraftPhase.CM_PickP3,
      DraftPhase.CM_PickP4,
      DraftPhase.CM_PickP5,
    ].includes(phase)
  ) {
    return "Pick";
  }
};

const array_to_string = (a: Array<string>): string =>
  a.length === 0 ? "\u200b" : a.join("\n");

class Draft {
  phase: DraftPhase = DraftPhase.CM_BanP1;

  pin_message: Discord.Message | undefined;

  picks: Array<Array<string>> = [[], []];
  bans: Array<Array<string>> = [[], []];

  current_captain = 1;
  counter = 0;

  cancelled = false;

  constructor(
    private channel: Discord.TextChannel,
    private Captain1: Discord.User,
    private Captain2: Discord.User
  ) {
    channel.send(this.message()).then((msg) => (this.pin_message = msg));
  }

  current_captain_name = () =>
    this.current_captain === 1
      ? this.Captain1.username
      : this.Captain2.username;
  current_cpt = (): Discord.User =>
    this.current_captain === 1 ? this.Captain1 : this.Captain2;
  other_cpt = (): 1 | 2 => (this.current_captain === 1 ? 2 : 1);

  is_valid(commander: string): boolean {
    return !(
      this.bans[0].includes(commander) ||
      this.bans[1].includes(commander) ||
      this.picks[0].includes(commander) ||
      this.picks[1].includes(commander)
    );
  }

  message(): Discord.MessageEmbed {
    const Embed = new Discord.MessageEmbed()
      .setColor("2d2d2d")
      .setTitle(`${this.Captain1.username} vs ${this.Captain2.username}`)
      .setDescription("Commanders Draft")
      .addField("Bans", array_to_string(this.bans[0]), true)
      .addField("Bans", array_to_string(this.bans[1]), true)
      .addField("\u200b", "\u200b", true)
      .setFooter(
        `Current Phase: ${this.current_captain_name()}'s ${phase_name(
          this.phase
        )}`
      );
    if (this.picks[0].length > 0 || this.picks[0].length > 0) {
      Embed.addField("Picks", array_to_string(this.picks[0]), true)
        .addField("Picks", array_to_string(this.picks[1]), true)
        .addField("\u200b", "\u200b", true);
    }
    if (this.phase === DraftPhase.CM_Complete) {
      Embed.setFooter("Finished");
    }
    if (this.cancelled) {
      Embed.setFooter("Cancelled");
    }
    return Embed;
  }

  update() {
    this.pin_message?.edit(this.message());
  }

  ban(captain: Discord.User, commander: string) {
    if (this.current_cpt() !== captain) {
      return;
    }
    if (
      ![
        DraftPhase.CM_BanP1,
        DraftPhase.CM_BanP2,
        DraftPhase.CM_BanP3,
        DraftPhase.CM_BanP4,
      ].includes(this.phase)
    ) {
      return;
    }
    if (!this.is_valid(commander)) {
      return;
    }

    this.bans[this.current_captain - 1].push(commander);

    if (this.phase === DraftPhase.CM_BanP1) {
      this.phase = DraftPhase.CM_BanP2;
      this.current_captain = this.other_cpt();
      this.update();
      return;
    }
    if (this.phase === DraftPhase.CM_BanP2) {
      this.phase = DraftPhase.CM_PickP1;
      this.current_captain = this.other_cpt();
      this.update();
      return;
    }

    if (this.phase === DraftPhase.CM_BanP3) {
      this.phase = DraftPhase.CM_BanP4;
      this.current_captain = this.other_cpt();
      this.update();
      return;
    }

    if (this.phase === DraftPhase.CM_BanP4) {
      this.phase = DraftPhase.CM_PickP4;
      this.current_captain = this.other_cpt();
      this.update();
      return;
    }
  }

  pick(captain: Discord.User, commander: string) {
    if (this.current_cpt() !== captain) {
      return;
    }
    if (
      ![
        DraftPhase.CM_PickP1,
        DraftPhase.CM_PickP2,
        DraftPhase.CM_PickP3,
        DraftPhase.CM_PickP4,
        DraftPhase.CM_PickP5,
      ].includes(this.phase)
    ) {
      return;
    }
    if (!this.is_valid(commander)) {
      return;
    }

    this.picks[this.current_captain - 1].push(commander);

    if (this.phase === DraftPhase.CM_PickP1) {
      this.phase = DraftPhase.CM_PickP2;
      this.current_captain = this.other_cpt();
      this.update();
      this.counter = 0;
      return;
    }

    if (this.phase === DraftPhase.CM_PickP2) {
      if (this.counter === 0) {
        this.update();
        this.counter = 1;
        return;
      } else {
        this.phase = DraftPhase.CM_PickP3;
        this.current_captain = this.other_cpt();
        this.update();
        return;
      }
    }

    if (this.phase === DraftPhase.CM_PickP3) {
      this.phase = DraftPhase.CM_BanP3;
      this.update();
      return;
    }

    if (this.phase === DraftPhase.CM_PickP4) {
      this.phase = DraftPhase.CM_PickP5;
      this.current_captain = this.other_cpt();
      this.update();
      return;
    }

    if (this.phase === DraftPhase.CM_PickP5) {
      this.phase = DraftPhase.CM_Complete;
      this.update();
      this.finish();
      return;
    }
  }

  finish() {
    drafts.delete(this.channel.id);
  }

  cancel(captain: Discord.User) {
    if (captain === this.Captain1 || captain === this.Captain2) {
      this.cancelled = true;
      this.update();
      this.finish();
    }
  }
}
