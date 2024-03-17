import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import NumberField from '../fields/NumberField';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { EventListener } from '../fields/event-listener/EventListener';
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
