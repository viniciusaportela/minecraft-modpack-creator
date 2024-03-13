import ChoiceField from './ChoiceField';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';

interface OperationFieldProps {
  path: string;
}

export const OperationField: FunctionWithDefaultConfig<OperationFieldProps> = ({
  path,
}: OperationFieldProps) => {
  return (
    <ChoiceField
      path={path}
      options={[
        { label: 'Addition', value: 0 },
        { label: 'Multiply Base', value: 1 },
        { label: 'Multiply Total', value: 2 },
      ]}
    />
  );
};

OperationField.getDefaultConfig = () => {
  return 0;
};
