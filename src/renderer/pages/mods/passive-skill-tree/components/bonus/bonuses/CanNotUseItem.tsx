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

export const CanNotUseItem: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <ItemCondition path={[...path, 'item_condition']} />
    </>
  );
};

CanNotUseItem.getDefaultConfig = () => {
  return {
    type: 'skilltree:cant_use_item',
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
