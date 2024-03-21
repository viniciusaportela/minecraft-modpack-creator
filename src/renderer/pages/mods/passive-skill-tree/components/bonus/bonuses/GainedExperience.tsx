import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import NumberField from '../fields/NumberField';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import { EventListener } from '../fields/event-listener/EventListener';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';
import { OperationField } from '../fields/OperationField';
import { PlayerMultiplier } from '../fields/player-multiplier/PlayerMultiplier';
import { TextField } from '../fields/TextField';
import { ItemConditionItemId } from '../fields/item-condition/ItemConditionItemId';
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
