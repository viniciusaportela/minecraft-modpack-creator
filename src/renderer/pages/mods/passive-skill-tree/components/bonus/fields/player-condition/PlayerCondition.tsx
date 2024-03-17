import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import PlayerConditionNone from './PlayerConditionNone';
import { PlayerConditionAttributeValue } from './PlayerConditionAttributeValue';
import { PlayerConditionBurning } from './PlayerConditionBurning';
import { ComponentChoice } from '../ComponentChoice';
import { PlayerConditionDualWielding } from './PlayerConditionDualWielding';
import { PlayerConditionEffectAmount } from './PlayerConditionEffectAmount';
import { PlayerConditionFishing } from './PlayerConditionFishing';
import { PlayerConditionFoodLevel } from './PlayerConditionFoodLevel';
import { PlayerConditionHasEffect } from './PlayerConditionHasEffect';
import { PlayerConditionHasGems } from './PlayerConditionHasGems';
import { PlayerConditionHasItemEquipped } from './PlayerConditionHasItemEquipped';
import { PlayerConditionHasItemInHand } from './PlayerConditionHasItemInHand';
import { PlayerConditionHealthPercentage } from './PlayerConditionHealthPercentage';
import { PlayerConditionUnderwater } from './PlayerConditionUnderwater';

type PlayerConditionType =
  | 'skilltree:none'
  | 'skilltree:attribute_value'
  | 'skilltree:burning'
  | 'skilltree:dual_wielding'
  | 'skilltree:effect_amount'
  | 'skilltree:fishing'
  | 'skilltree:food_level'
  | 'skilltree:has_effect'
  | 'skilltree:has_gems'
  | 'skilltree:has_item_equipped'
  | 'skilltree:has_item_in_hand'
  | 'skilltree:health_percentage'
  | 'skilltree:underwater';

const OPTIONS: {
  label: string;
  value: PlayerConditionType;
  component: FunctionWithDefaultConfig;
}[] = [
  {
    label: 'None',
    value: 'skilltree:none',
    component: PlayerConditionNone,
  },
  {
    label: 'Attribute Value',
    value: 'skilltree:attribute_value',
    component: PlayerConditionAttributeValue,
  },
  {
    label: 'Burning',
    value: 'skilltree:burning',
    component: PlayerConditionBurning,
  },
  {
    label: 'Dual Wielding',
    value: 'skilltree:dual_wielding',
    component: PlayerConditionDualWielding,
  },
  {
    label: 'Effect Amount',
    value: 'skilltree:effect_amount',
    component: PlayerConditionEffectAmount,
  },
  {
    label: 'Fishing',
    value: 'skilltree:fishing',
    component: PlayerConditionFishing,
  },
  {
    label: 'Food Level',
    value: 'skilltree:food_level',
    component: PlayerConditionFoodLevel,
  },
  {
    label: 'Has Effect',
    value: 'skilltree:has_effect',
    component: PlayerConditionHasEffect,
  },
  {
    label: 'Has Gems',
    value: 'skilltree:has_gems',
    component: PlayerConditionHasGems,
  },
  {
    label: 'Has Item Equipped',
    value: 'skilltree:has_item_equipped',
    component: PlayerConditionHasItemEquipped,
  },
  {
    label: 'Has Item In Hand',
    value: 'skilltree:has_item_in_hand',
    component: PlayerConditionHasItemInHand,
  },
  {
    label: 'Health Percentage',
    value: 'skilltree:health_percentage',
    component: PlayerConditionHealthPercentage,
  },
  {
    label: 'Underwater',
    value: 'skilltree:underwater',
    component: PlayerConditionUnderwater,
  },
];

export const PlayerCondition: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <ComponentChoice
      label="Player Condition"
      path={path}
      options={OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
        component: option.component,
      }))}
    />
  );
};

PlayerCondition.getDefaultConfig = () => {
  return PlayerConditionNone.getDefaultConfig();
};
