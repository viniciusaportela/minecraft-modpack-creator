import { Input } from '@nextui-org/react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';

interface NumberFieldProps {
  path: string[];
  label: string;
  acceptMinusOne?: boolean;
}

export default function NumberField({
  path,
  label,
  acceptMinusOne,
}: NumberFieldProps) {
  const [value, setValue] = useModConfig(path);

  return (
    <>
      <Label>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1 h-10',
        }}
        value={value ?? -1}
        type="number"
        onValueChange={(newValue) =>
          setValue(() =>
            parseFloat(newValue) === -1 && !acceptMinusOne
              ? undefined
              : newValue,
          )
        }
      />
    </>
  );
}
