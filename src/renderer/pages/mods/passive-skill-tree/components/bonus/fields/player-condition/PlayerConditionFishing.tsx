import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerConditionFishing: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerConditionFishing.getDefaultConfig = () => {
  return {
    type: 'skilltree:fishing',
  };
};
