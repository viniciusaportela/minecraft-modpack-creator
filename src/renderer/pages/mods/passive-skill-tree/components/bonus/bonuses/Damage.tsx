import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
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

export const Damage: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <OperationField path={[...path, 'operation']} />
      <NumberField path={[...path, 'amount']} label="Amount" />
      <PlayerCondition path={[...path, 'target_condition']} />
      <ChoiceField
        path={[...path, 'damage_condition']}
        label="Damage Condition"
        options={DAMAGE_OPTIONS}
      />
      <PlayerCondition path={[...path, 'player_condition']} />
      <PlayerMultiplier path={[...path, 'enemy_multiplier']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
    </>
  );
};

Damage.getDefaultConfig = () => {
  return {
    type: 'skilltree:damage',
    operation: OperationField.getDefaultConfig(),
    amount: 0.1,
    target_condition: PlayerCondition.getDefaultConfig(),
    damage_condition: 'skilltree:none',
    player_condition: PlayerCondition.getDefaultConfig(),
    enemy_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
  };
};
