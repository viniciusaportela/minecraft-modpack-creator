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

export const HealthReservation: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'amount']} label="Amount" />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <PlayerCondition path={[...path, 'player_condition']} />
    </>
  );
};

HealthReservation.getDefaultConfig = () => {
  return {
    type: 'skilltree:health_reservation',
    amount: 0.05,
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    player_condition: PlayerCondition.getDefaultConfig(),
  };
};
