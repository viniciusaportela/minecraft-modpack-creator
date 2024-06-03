import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
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
    type: 'skilltree:enchantment_amplification',
    enchantment_condition: 'skilltree:none',
    chance: 0.1,
  };
};
