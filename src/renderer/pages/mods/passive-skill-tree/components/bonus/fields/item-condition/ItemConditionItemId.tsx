import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { TextField } from '../TextField';

export const ItemConditionItemId: FunctionWithDefaultConfig = ({ path }) => {
  return <TextField path={[...path, 'id']} label="Item Id" />;
};

ItemConditionItemId.getDefaultConfig = () => {
  return {
    type: 'skilltree:item_id',
    id: 'minecraft:shield',
  };
};
