import { Input } from '@nextui-org/react';
import { useModConfigByPath } from '../../../../../../hooks/use-mod-config';

interface NumberFieldProps {
  path: string;
}

export default function NumberField({ path }: NumberFieldProps) {
  const [value, setValue] = useModConfigByPath(path);

  return <Input value={value} onValueChange={setValue} />;
}
