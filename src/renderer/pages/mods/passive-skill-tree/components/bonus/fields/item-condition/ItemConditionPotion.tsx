import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import ChoiceField from '../ChoiceField';

const OPTIONS = [
  {
    label: 'Neutral',
    value: 'neutral',
  },
  {
    label: 'Beneficial',
    value: 'beneficial',
  },
  {
    label: 'Harmful',
    value: 'harmful',
  },
];

export const ItemConditionPotion: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <ChoiceField
      path={[...path, 'potion_type']}
      options={OPTIONS}
      label="Potion Type"
    />
  );
};

ItemConditionPotion.getDefaultConfig = () => {
  return {
    type: 'skilltree:potion',
    potion_type: 'neutral',
  };
};
