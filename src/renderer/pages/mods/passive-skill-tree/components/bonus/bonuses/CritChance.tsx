import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import ChoiceField from '../fields/ChoiceField';

const DAMAGE_OPTIONS = [
  {
    label: 'Melee',
    value: 'skilltree:melee',
  },
  {
    label: 'Projectile',
    value: 'skilltree:projectile',
  },
  {
    label: 'None',
    value: 'skilltree:none',
  },
];

export const CritChance: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <PlayerCondition path={[...path, 'player_condition']} />
      <PlayerMultiplier path={[...path, 'enemy_multiplier']} />
      <PlayerCondition path={[...path, 'target_condition']} />
      <ChoiceField
        path={[...path, 'damage_condition']}
        label="Damage Condition"
        options={DAMAGE_OPTIONS}
      />
    </>
  );
};

CritChance.getDefaultConfig = () => {
  return {
    type: 'skilltree:crit_chance',
    chance: 0.05,
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
    enemy_multiplier: PlayerMultiplier.getDefaultConfig(),
    target_condition: PlayerCondition.getDefaultConfig(),
    damage_condition: 'skilltree:none',
  };
};
