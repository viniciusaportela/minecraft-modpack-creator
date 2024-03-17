import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const ItemBonusFoodHealing: FunctionWithDefaultConfig = ({ path }) => {
  return <NumberField path={[...path, 'amount']} label="Amount" />;
};

ItemBonusFoodHealing.getDefaultConfig = () => {
  return {
    type: 'skilltree:food_healing',
    amount: 2,
  };
};
