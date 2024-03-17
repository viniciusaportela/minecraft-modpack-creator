import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerConditionUnderwater: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerConditionUnderwater.getDefaultConfig = () => {
  return {
    type: 'skilltree:underwater',
  };
};
