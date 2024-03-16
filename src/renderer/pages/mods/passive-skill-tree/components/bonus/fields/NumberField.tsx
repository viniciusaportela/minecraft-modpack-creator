import { Input } from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';

interface NumberFieldProps {
  path: string[];
}

export default function NumberField({ path }: NumberFieldProps) {
  const [value, setValue] = useModConfig(path);

  return (
    <Input
      value={value}
      onValueChange={(newValue) => setValue(() => newValue)}
    />
  );
}
