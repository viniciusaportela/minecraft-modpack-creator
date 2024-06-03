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
    label: 'Ore',
    value: 'ore',
  },
];

export const GainedExperience: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
      <ChoiceField
        path={[...path, 'experience_source']}
        options={OPTIONS}
        label="Experience Source"
      />
    </>
  );
};

GainedExperience.getDefaultConfig = () => {
  return {
    type: 'skilltree:gained_experience',
    multiplier: 0.25,
    experience_source: 'mobs',
  };
};
