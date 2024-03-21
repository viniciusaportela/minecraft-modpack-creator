import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import NumberField from '../fields/NumberField';
import { ItemCondition } from '../fields/item-condition/ItemCondition';

export const GemPower: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <ItemCondition path={[...path, 'item_condition']} />
      <NumberField path={[...path, 'multiplier']} label="Multiplier" />
    </>
  );
};

GemPower.getDefaultConfig = () => {
  return {
    type: 'skilltree:gem_power',
    item_condition: ItemCondition.getDefaultConfig(),
    multiplier: 0.1,
  };
};
