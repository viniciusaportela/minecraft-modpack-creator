import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import NumberField from '../fields/NumberField';

export const ArrowRetrieval: FunctionWithDefaultConfig = ({ path }) => {
  return <NumberField path={[...path, 'chance']} label="Chance" />;
};

ArrowRetrieval.getDefaultConfig = () => {
  return {
    type: 'skilltree:arrow_retrieval',
    chance: 0.05,
  };
};
