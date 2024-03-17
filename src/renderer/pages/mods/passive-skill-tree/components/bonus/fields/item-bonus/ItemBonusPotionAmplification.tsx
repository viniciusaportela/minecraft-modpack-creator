import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';

export const ItemBonusPotionAmplification: FunctionWithDefaultConfig = ({
  path,
}) => {
  return <NumberField path={[...path, 'chance']} label="Chance" />;
};

ItemBonusPotionAmplification.getDefaultConfig = () => {
  return {
    type: 'skilltree:potion_amplification',
    chance: 0.1,
  };
};
