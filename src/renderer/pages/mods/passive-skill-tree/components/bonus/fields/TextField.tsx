import { Input } from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface TextFieldProps {
  path: string[];
  label: string;
}

export const TextField = ({ path, label }: TextFieldProps) => {
  const [value, setValue] = useModConfig(path);

  return (
    <>
      <Label>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1 h-10',
        }}
        value={value}
        onValueChange={(newValue) => setValue(() => newValue)}
      />
    </>
  );
};
