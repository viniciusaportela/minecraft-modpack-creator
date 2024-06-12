import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import { DamageCondition } from '../fields/damage-condition/DamageCondition';

export const Damage: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <OperationField path={[...path, 'operation']} />
      <NumberField path={[...path, 'amount']} label="Amount" />
      <PlayerCondition path={[...path, 'target_condition']} />
      <DamageCondition path={[...path, 'damage_condition']} />
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
    damage_condition: DamageCondition.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
    enemy_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
  };
};
