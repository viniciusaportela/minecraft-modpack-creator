import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';

export const ItemConditionFood: FunctionWithDefaultConfig = () => {
  return null;
};

ItemConditionFood.getDefaultConfig = () => {
  return {
    type: 'skilltree:food',
  };
};
