import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import NumberField from '../fields/NumberField';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { EventListener } from '../fields/event-listener/EventListener';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import { TextField } from '../fields/TextField';

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
