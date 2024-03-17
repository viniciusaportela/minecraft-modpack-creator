import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const ItemBonusFoodSaturation: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <NumberField path={[...path, 'multiplier']} label="Multiplier" />;
};

ItemBonusFoodSaturation.getDefaultConfig = () => {
  return {
    type: 'skilltree:food_saturation',
    multiplier: 0.1,
  };
};
