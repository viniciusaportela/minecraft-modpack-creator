import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { TextField } from '../fields/TextField';

export const RecipeUnlock: FunctionWithDefaultConfig = ({ path }) => {
  return <TextField path={[...path, 'recipe_id']} label="Recipe Id" />;
};

RecipeUnlock.getDefaultConfig = () => {
  return {
    type: 'skilltree:recipe_unlock',
    recipe_id: 'skilltree:weapon_poisoning',
  };
};
