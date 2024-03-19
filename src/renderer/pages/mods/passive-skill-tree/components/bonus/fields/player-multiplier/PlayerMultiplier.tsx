import { PlayerMultiplierNone } from './PlayerMultiplierNone';
import { ComponentChoice } from '../ComponentChoice';
import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { PlayerMultiplierDistanceToTarget } from './PlayerMultiplierDistanceToTarget';
import { PlayerMultiplierEffectAmount } from './PlayerMultiplierEffectAmount';
import { PlayerMultiplierAttributeValue } from './PlayerMultiplierAttributeValue';
import { PlayerMultiplierEnchantsLevels } from './PlayerMultiplierEnchantsLevels';
import { PlayerMultiplierEnchantsAmount } from './PlayerMultiplierEnchantsAmount';
import { PlayerMultiplierFoodLevel } from './PlayerMultiplierFoodLevel';
import { PlayerMultiplierGemsAmount } from './PlayerMultiplierGemsAmount';
import { PlayerMultiplierMissingHealthPercentage } from './PlayerMultiplierMissingHealthPercentage';
import { PlayerMultiplierMissingHealthPoints } from './PlayerMultiplierMissingHealthPoints';

const OPTIONS: {
  label: string;
  value: string;
  component: FunctionWithDefaultConfig;
}[] = [
  {
    label: 'None',
    value: 'skilltree:none',
    component: PlayerMultiplierNone,
  },
  {
    label: 'Attribute Value',
    value: 'skilltree:attribute_value',
    component: PlayerMultiplierAttributeValue,
  },
  {
    label: 'Distance to Target',
    value: 'skilltree:distance_to_target',
    component: PlayerMultiplierDistanceToTarget,
  },
  {
    label: 'Effect Amount',
    value: 'skilltree:effect_amount',
    component: PlayerMultiplierEffectAmount,
  },
  {
    label: 'Enchants Amount',
    value: 'skilltree:enchants_amount',
    component: PlayerMultiplierEnchantsAmount,
  },
  {
    label: 'Enchants Levels',
    value: 'skilltree:enchants_levels',
    component: PlayerMultiplierEnchantsLevels,
  },
  {
    label: 'Food Level',
    value: 'skilltree:food_level',
    component: PlayerMultiplierFoodLevel,
  },
  {
    label: 'Gems Amount',
    value: 'skilltree:gems_amount',
    component: PlayerMultiplierGemsAmount,
  },
  {
    label: 'Missing Health Percentage',
    value: 'skilltree:missing_health_percentage',
    component: PlayerMultiplierMissingHealthPercentage,
  },
  {
    label: 'Missing Health Points',
    value: 'skilltree:missing_health_points',
    component: PlayerMultiplierMissingHealthPoints,
  },
];

interface PlayerMultiplierProps {
  path: string[];
  label?: string;
}

export const PlayerMultiplier: FunctionWithDefaultConfig<
  PlayerMultiplierProps
> = ({ path, label }) => {
  return (
    <ComponentChoice
      path={path}
      label={label ?? 'Player Multiplier'}
      options={OPTIONS}
    />
  );
};

PlayerMultiplier.getDefaultConfig = () => {
  return PlayerMultiplierNone.getDefaultConfig();
};
