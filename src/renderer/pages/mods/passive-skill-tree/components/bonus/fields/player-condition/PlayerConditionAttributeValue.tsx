import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { TextField } from '../TextField';

interface PlayerConditionAttributeValueProps {
  path: string[];
}

// TODO get attribute list with KubeJS
export const PlayerConditionAttributeValue: FunctionWithDefaultConfig<
  PlayerConditionAttributeValueProps
> = ({ path }) => {
  return (
    <>
      <TextField path={[...path, 'attribute']} label="Attribute" />
      <NumberField path={[...path, 'min']} label="Min" />
      <NumberField path={[...path, 'max']} label="Max" />
    </>
  );
};

PlayerConditionAttributeValue.getDefaultConfig = () => {
  return {
    type: 'skilltree:attribute_value',
    attribute: 'minecraft:generic.armor',
    min: 5,
    max: undefined,
  };
};
