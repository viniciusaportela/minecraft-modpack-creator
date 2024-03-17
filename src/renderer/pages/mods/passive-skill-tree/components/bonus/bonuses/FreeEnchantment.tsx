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

export const FreeEnchantment: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
    </>
  );
};

FreeEnchantment.getDefaultConfig = () => {
  return {
    type: 'skilltree:free_enchantment',
    chance: 0.05,
  };
};
