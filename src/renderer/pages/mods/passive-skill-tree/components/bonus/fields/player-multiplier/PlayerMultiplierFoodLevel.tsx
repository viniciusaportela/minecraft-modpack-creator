import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerMultiplierFoodLevel: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerMultiplierFoodLevel.getDefaultConfig = () => {
  return {
    type: 'skilltree:food_level',
  };
};
