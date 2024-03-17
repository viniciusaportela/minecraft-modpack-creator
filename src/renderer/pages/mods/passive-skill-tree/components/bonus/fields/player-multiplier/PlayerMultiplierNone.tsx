import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const PlayerMultiplierNone: FunctionWithDefaultConfig = () => {
  return null;
};

PlayerMultiplierNone.getDefaultConfig = () => {
  return {
    type: 'skilltree:none',
  };
};
