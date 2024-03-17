import NumberField from '../fields/NumberField';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { OperationField } from '../fields/OperationField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';

export const AllAttributes: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'amount']} label="Amount" />
      <OperationField path={[...path, 'operation']} />
      <PlayerCondition path={[...path, 'player_condition']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
    </>
  );
};

AllAttributes.getDefaultConfig = () => {
  return {
    type: 'skilltree:all_attributes',
    amount: 1,
    operation: OperationField.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
  };
};
