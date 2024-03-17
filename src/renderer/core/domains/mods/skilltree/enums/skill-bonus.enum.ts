import { AllAttributes } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/AllAttributes';
import { FunctionWithDefaultConfig } from '../../../../../pages/mods/passive-skill-tree/interfaces/function-with-default-config';
import { ArrowRetrieval } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/ArrowRetrieval';
import { CraftedItemBonus } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/CraftedItemBonus';
import { QuiverCapacity } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/QuiverCapacity';
import { PlayerSockets } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/PlayerSockets';
import { RecipeUnlock } from '../../../../../pages/mods/passive-skill-tree/components/bonus/bonuses/RecipeUnlock';

export enum EBonus {
  AllAttributes = 'skilltree:all_attributes',
  ArrowRetrieval = 'skilltree:arrow_retrieval',
  CraftedItemBOnus = 'skilltree:created_item_bonus',
  PlayerSockets = 'skilltree:player_sockets',
  QuiverCapacity = 'skilltree:quiver_capacity',
  RecipeUnlock = 'skilltree:recipe_unlock',
}

export const ALL_BONUSES = [EBonus.AllAttributes];

export const COMPONENTS_BY_BONUS: Record<EBonus, FunctionWithDefaultConfig> = {
  [EBonus.AllAttributes]: AllAttributes,
  [EBonus.ArrowRetrieval]: ArrowRetrieval,
  [EBonus.CraftedItemBOnus]: CraftedItemBonus,
  [EBonus.PlayerSockets]: PlayerSockets,
  [EBonus.QuiverCapacity]: QuiverCapacity,
  [EBonus.RecipeUnlock]: RecipeUnlock,
};

export const ReadableByBonus: Record<EBonus, string> = {
  [EBonus.AllAttributes]: 'All Attributes',
  [EBonus.ArrowRetrieval]: 'Arrow Retrieval',
  [EBonus.CraftedItemBOnus]: 'Crafted Item Bonus',
  [EBonus.PlayerSockets]: 'Player Sockets',
  [EBonus.QuiverCapacity]: 'Quiver Capacity',
  [EBonus.RecipeUnlock]: 'Recipe Unlock',
};
