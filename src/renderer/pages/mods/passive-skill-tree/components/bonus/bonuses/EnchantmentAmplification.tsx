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

const OPTIONS = [
  {
    label: 'Armor',
    value: 'skilltree:armor',
  },
  {
    label: 'Weapon',
    value: 'skilltree:weapon',
  },
  {
    label: 'None',
    value: 'skilltree:none',
  },
];

export const EnchantmentAmplification: FunctionWithDefaultConfig = ({
  path,
}) => {
  return (
    <>
      <ChoiceField
        path={[...path, 'enchantment_condition']}
        label="Enchantment Condition"
        options={OPTIONS}
      />
      <NumberField path={[...path, 'chance']} label="Chance" />
    </>
  );
};

EnchantmentAmplification.getDefaultConfig = () => {
  return {
    type: 'skilltree:enchnatment_amplification',
    enchantment_condition: 'skilltree:none',
    chance: 0.1,
  };
};
