import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';

export const JumpHeight: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <PlayerCondition path={[...path, 'player_condition']} />
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
    </>
  );
};

JumpHeight.getDefaultConfig = () => {
  return {
    type: 'skilltree:jump_height',
    player_condition: PlayerCondition.getDefaultConfig(),
    multiplier: 0.1,
  };
};
