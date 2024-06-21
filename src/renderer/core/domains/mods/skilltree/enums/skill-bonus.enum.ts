import { AllAttributes } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/AllAttributes';
import { ArrowRetrieval } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/ArrowRetrieval';
import { CraftedItemBonus } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/CraftedItemBonus';
import { QuiverCapacity } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/QuiverCapacity';
import { PlayerSockets } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/PlayerSockets';
import { RecipeUnlock } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/RecipeUnlock';
import { Command } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/Command';
import { CanNotUseItem } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/CanNotUseItem';
import { BlockBreakSpeed } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/BlockBreakSpeed';
import { Attribute } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/Attribute';
import { CritChance } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/CritChance';
import { CritDamage } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/CritDamage';
import { Damage } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/Damage';
import { EnchantmentRequirement } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/EnchantmentRequirement';
import { EnchantmentAmplification } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/EnchantmentAmplification';
import { FreeEnchantment } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/FreeEnchantment';
import { GainedExperience } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/GainedExperience';
import { GemPower } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/GemPower';
import { Healing } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/Healing';
import { HealthReservation } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/HealthReservation';
import { Ignite } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/Ignite';
import { IncomingHealing } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/IncomingHealing';
import { JumpHeight } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/JumpHeight';
import { LootDuplication } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/LootDuplication';
import { RepairEfficiency } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/RepairEfficiency';
import { FunctionWithDefaultConfig } from '../../../../../pages/mods/passive-skill-tree/interfaces/function-with-default-config';

export enum EBonus {
  AllAttributes = 'skilltree:all_attributes',
  ArrowRetrieval = 'skilltree:arrow_retrieval',
  Attribute = 'skilltree:attribute',
  BlockBreakSpeed = 'skilltree:block_break_speed',
  CanNotUseItem = 'skilltree:cant_use_item',
  Command = 'skilltree:command',
  CraftedItemBonus = 'skilltree:crafted_item_bonus',
  CritChance = 'skilltree:crit_chance',
  CritDamage = 'skilltree:crit_damage',
  Damage = 'skilltree:damage',
  EnchantmentAmplification = 'skilltree:enchantment_amplification',
  EnchantmentRequirement = 'skilltree:enchantment_requirement',
  FreeEnchantment = 'skilltree:free_enchantment',
  GainedExperience = 'skilltree:gained_experience',
  GemPower = 'skilltree:gem_power',
  Healing = 'skilltree:healing',
  HealthReservation = 'skilltree:health_reservation',
  Ignite = 'skilltree:ignite',
  IncomingHealing = 'skilltree:incoming_healing',
  JumpHeight = 'skilltree:jump_height',
  LootDuplication = 'skilltree:loot_duplication',
  PlayerSockets = 'skilltree:player_sockets',
  QuiverCapacity = 'skilltree:quiver_capacity',
  RecipeUnlock = 'skilltree:recipe_unlock',
  RepairEfficiency = 'skilltree:repair_efficiency',
}

export const ALL_BONUSES = Object.values(EBonus);

export const COMPONENTS_BY_BONUS = (): Record<
  EBonus,
  FunctionWithDefaultConfig
> => ({
  [EBonus.AllAttributes]: AllAttributes,
  [EBonus.ArrowRetrieval]: ArrowRetrieval,
  [EBonus.CraftedItemBonus]: CraftedItemBonus,
  [EBonus.PlayerSockets]: PlayerSockets,
  [EBonus.QuiverCapacity]: QuiverCapacity,
  [EBonus.RecipeUnlock]: RecipeUnlock,
  [EBonus.Attribute]: Attribute,
  [EBonus.BlockBreakSpeed]: BlockBreakSpeed,
  [EBonus.CanNotUseItem]: CanNotUseItem,
  [EBonus.Command]: Command,
  [EBonus.CritChance]: CritChance,
  [EBonus.CritDamage]: CritDamage,
  [EBonus.Damage]: Damage,
  [EBonus.EnchantmentAmplification]: EnchantmentAmplification,
  [EBonus.EnchantmentRequirement]: EnchantmentRequirement,
  [EBonus.FreeEnchantment]: FreeEnchantment,
  [EBonus.GainedExperience]: GainedExperience,
  [EBonus.GemPower]: GemPower,
  [EBonus.Healing]: Healing,
  [EBonus.HealthReservation]: HealthReservation,
  [EBonus.Ignite]: Ignite,
  [EBonus.IncomingHealing]: IncomingHealing,
  [EBonus.JumpHeight]: JumpHeight,
  [EBonus.LootDuplication]: LootDuplication,
  [EBonus.RepairEfficiency]: RepairEfficiency,
});

export const ReadableByBonus: Record<EBonus, string> = {
  [EBonus.AllAttributes]: 'All Attributes',
  [EBonus.ArrowRetrieval]: 'Arrow Retrieval',
  [EBonus.CraftedItemBonus]: 'Crafted Item Bonus',
  [EBonus.PlayerSockets]: 'Player Sockets',
  [EBonus.QuiverCapacity]: 'Quiver Capacity',
  [EBonus.RecipeUnlock]: 'Recipe Unlock',
  [EBonus.Attribute]: 'Attribute',
  [EBonus.BlockBreakSpeed]: 'Block Break Speed',
  [EBonus.CanNotUseItem]: 'Can Not Use Item',
  [EBonus.Command]: 'Command',
  [EBonus.CritChance]: 'Crit Chance',
  [EBonus.CritDamage]: 'Crit Damage',
  [EBonus.Damage]: 'Damage',
  [EBonus.EnchantmentAmplification]: 'Enchantment Amplification',
  [EBonus.EnchantmentRequirement]: 'Enchantment Requirement',
  [EBonus.FreeEnchantment]: 'Free Enchantment',
  [EBonus.GainedExperience]: 'Gained Experience',
  [EBonus.GemPower]: 'Gem Power',
  [EBonus.Healing]: 'Healing',
  [EBonus.HealthReservation]: 'Health Reservation',
  [EBonus.Ignite]: 'Ignite',
  [EBonus.IncomingHealing]: 'Incoming Healing',
  [EBonus.JumpHeight]: 'Jump Height',
  [EBonus.LootDuplication]: 'Loot Duplication',
  [EBonus.RepairEfficiency]: 'Repair Efficiency',
};
