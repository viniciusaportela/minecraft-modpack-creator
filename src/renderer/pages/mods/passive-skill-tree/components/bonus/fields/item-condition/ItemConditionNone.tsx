import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const ItemConditionNone: FunctionWithDefaultConfig = () => {
  return null;
};

ItemConditionNone.getDefaultConfig = () => {
  return {
    type: 'skilltree:none',
  };
};
