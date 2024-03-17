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
        label={'Loot Type'}
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
