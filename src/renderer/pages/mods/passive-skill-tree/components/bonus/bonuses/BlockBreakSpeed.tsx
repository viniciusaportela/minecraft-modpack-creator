import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';

export const BlockBreakSpeed: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <PlayerCondition path={[...path, 'player_condition']} />
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
    </>
  );
};

BlockBreakSpeed.getDefaultConfig = () => {
  return {
    type: 'skilltree:block_break_speed',
    player_condition: PlayerCondition.getDefaultConfig(),
    multiplier: 0.1,
  };
};
