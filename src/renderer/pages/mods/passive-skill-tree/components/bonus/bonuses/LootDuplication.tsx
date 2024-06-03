import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import ChoiceField from '../fields/ChoiceField';

const OPTIONS = [
  {
    label: 'Mobs',
    value: 'mobs',
  },
  {
    label: 'Fishing',
    value: 'fishing',
  },
  {
    label: 'Gems',
    value: 'gems',
  },
];

export const LootDuplication: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'chance']} label="Chance" />
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
      <ChoiceField
        path={[...path, 'loot_type']}
        options={OPTIONS}
        label="Loot Type"
      />
    </>
  );
};

LootDuplication.getDefaultConfig = () => {
  return {
    type: 'skilltree:loot_duplication',
    chance: 0.05,
    multiplier: 1,
    loot_type: 'fishing',
  };
};
