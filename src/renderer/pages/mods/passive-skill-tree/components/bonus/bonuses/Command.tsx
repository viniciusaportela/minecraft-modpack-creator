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

export const Command: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <TextField path={[...path, 'command']} label="Command" />
      <TextField path={[...path, 'remove_command']} label="Remove Command" />
    </>
  );
};

Command.getDefaultConfig = () => {
  return {
    type: 'skilltree:command',
    command: '',
    remove_command: '',
  };
};
