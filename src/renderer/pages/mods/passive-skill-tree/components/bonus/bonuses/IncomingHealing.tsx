import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import NumberField from '../fields/NumberField';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { EventListener } from '../fields/event-listener/EventListener';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import { TextField } from '../fields/TextField';
import { ItemConditionItemId } from '../fields/item-condition/ItemConditionItemId';
import ChoiceField from '../fields/ChoiceField';

export const IncomingHealing: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <PlayerCondition path={[...path, 'player_condition']} />
    </>
  );
};

IncomingHealing.getDefaultConfig = () => {
  return {
    type: 'skilltree:incoming_healing',
    multiplier: 0.15,
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
  };
};
