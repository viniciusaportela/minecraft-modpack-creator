import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';

export const EnchantmentRequirement: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <NumberField
      path={[...path, 'multiplier']}
      label="Multiplier"
      acceptMinusOne
    />
  );
};

EnchantmentRequirement.getDefaultConfig = () => {
  return {
    type: 'skilltree:enchantment_requirement',
    multiplier: -0.05,
  };
};
