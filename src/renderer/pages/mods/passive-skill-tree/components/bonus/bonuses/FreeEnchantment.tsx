import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';

export const FreeEnchantment: FunctionWithDefaultConfig = ({ path }) => {
  return <NumberField path={[...path, 'chance']} label="Chance" />;
};

FreeEnchantment.getDefaultConfig = () => {
  return {
    type: 'skilltree:free_enchantment',
    chance: 0.05,
  };
};
