import { Input } from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface NumberFieldProps {
  path: string[];
  label: string;
}

export default function NumberField({ path, label }: NumberFieldProps) {
  const [value, setValue] = useModConfig(path);

  return (
    <>
      <Label>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1',
        }}
        value={value}
        type="number"
        onValueChange={(newValue) => setValue(() => newValue)}
      />
    </>
  );
}
