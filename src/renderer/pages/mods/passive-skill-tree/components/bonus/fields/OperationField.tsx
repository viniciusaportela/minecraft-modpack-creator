import ChoiceField from './ChoiceField';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { NestWrapper } from '../NestWrapper';

interface OperationFieldProps {
  path: string[];
}

export const OperationField: FunctionWithDefaultConfig<OperationFieldProps> = ({
  path,
}: OperationFieldProps) => (
  <NestWrapper nestLevel={path.length}>
    <ChoiceField
      label="Operation"
      path={path}
      options={[
        { label: 'Addition', value: 0 },
        { label: 'Multiply Base', value: 1 },
        { label: 'Multiply Total', value: 2 },
      ]}
    />
  </NestWrapper>
);

OperationField.getDefaultConfig = () => {
  return 0;
};
