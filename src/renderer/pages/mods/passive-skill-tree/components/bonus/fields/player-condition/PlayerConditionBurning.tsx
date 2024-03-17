import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerConditionBurning: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerConditionBurning.getDefaultConfig = () => {
  return {
    type: 'skilltree:burning',
  };
};
