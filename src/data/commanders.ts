import commandersData from "./commanders.json";
import commanderUpgradeData from "./commanders_info.json";

import unitData from "./units.json";
import abilityData from "./abilities.json";
import upgradeData from "./upgrades.json";

export const Commanders: Map<string, string> = new Map();

for (const cmd of commandersData) {
  for (const alias of cmd.Aliases) {
    Commanders.set(alias, cmd.Commander);
  }
}

export interface Weapon {
  name: string;
  range: number;
  count?: number;
  damage: {
    base: number;
    versus: {
      [key: string]: number;
    };
  };
  period: number;
  targets: Array<string>;
  level: {
    base: number;
    versus: {
      [key: string]: number;
    };
  };
}

export interface Unit {
  name: string;
  commanders: Array<string>;
  tier: number;
  cost: number;
  life: number;
  types: Array<string>;
  shields?: number;
  shield_armor?: number;
  energy_start?: number;
  energy_max?: number;
  speed: number;
  armor: number;
  weapons: Array<Weapon>;
  abilities: Array<string>;
  upgrades: Array<string>;
}

export interface Upgrade {
  name: string;
  commanders: Array<string>;
  cost: number;
  requirements: Array<string>;
  description: string;
}

export interface Ability {
  name: string;
  units: Array<string>;
  commanders: Array<string>;
  requirements: Array<string>;
  cooldown?: number;
  duration?: number;
  cost?: {
    energy?: number;
    life?: number;
  };
  description: string;
}

interface RacialUpgrade {
  name: string;
  cost: string;
}

export interface CommanderUpgrade {
  commander: string;
  upgrades: Array<RacialUpgrade>;
}

export const units: Array<Unit> = <Array<Unit>>unitData;
export const upgrades: Array<Upgrade> = <Array<Upgrade>>upgradeData;
export const abilities: Array<Ability> = <Array<Ability>>abilityData;
export const commanderUpgrades: Array<CommanderUpgrade> = <
  Array<CommanderUpgrade>
>commanderUpgradeData;

upgrades.forEach((abil) => {
  if (!abil.requirements) {
    console.log(abil.name);
  }
});
