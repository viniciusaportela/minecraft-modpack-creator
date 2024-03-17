import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerMultiplierEffectAmount: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerMultiplierEffectAmount.getDefaultConfig = () => {
  return {
    type: 'skilltree:effect_amount',
  };
};
