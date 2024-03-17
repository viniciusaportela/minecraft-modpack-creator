import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { TextField } from '../TextField';

export const ItemConditionTag: FunctionWithDefaultConfig = ({ path }) => {
  return <TextField path={[...path, 'tag_id']} label="Tag" />;
};

ItemConditionTag.getDefaultConfig = () => {
  return {
    type: 'skilltree:tag',
    tag_id: 'forge:armors',
  };
};
