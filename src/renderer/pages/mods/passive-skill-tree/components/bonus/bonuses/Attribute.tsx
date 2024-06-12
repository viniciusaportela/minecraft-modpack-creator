import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import { TextField } from '../fields/TextField';

export const Attribute: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <TextField path={[...path, 'attribute']} label="Attribute" />
      <NumberField path={[...path, 'amount']} label="Amount" />
      <OperationField path={[...path, 'operation']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <PlayerCondition path={[...path, 'player_condition']} />
    </>
  );
};

Attribute.getDefaultConfig = () => {
  return {
    type: 'skilltree:attribute',
    attribute: 'minecraft:generic.armor',
    amount: 1,
    operation: OperationField.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
  };
};
