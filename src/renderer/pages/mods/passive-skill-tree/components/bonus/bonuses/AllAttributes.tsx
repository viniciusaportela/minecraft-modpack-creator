import NumberField from '../fields/NumberField';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { BonusProps } from '../../../interfaces/bonus-props.interface';
import { OperationField } from '../fields/OperationField';
import { PlayerCondition } from '../fields/player-condition/PlayerCondition';

export const AllAttributes: FunctionWithDefaultConfig<BonusProps> = ({
  bonusPath,
}) => {
  return (
    <>
      <NumberField path={`${bonusPath}.amount`} />
      <OperationField path={`${bonusPath}.operation`} />
      <PlayerCondition path={`${bonusPath}.player_condition`} />
    </>
  );
};

AllAttributes.getDefaultConfig = () => {
  return {
    amount: 1,
    operation: 'add',
    player_condition: PlayerCondition.getDefaultConfig(),
  };
};
