import { Input } from '@nextui-org/react';
import Label from './Label';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';
import { NestWrapper } from '../NestWrapper';

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
  const [value, setValue] = useModConfigSelector(path);

  return (
    <NestWrapper nestLevel={path.length}>
      <Label nestLevel={path.length}>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1 h-10',
        }}
        value={value ?? -1}
        type="number"
        onValueChange={(newValue) => {
          const formattedValue = newValue.replace(',', '.');
          const numberValue = parseFloat(formattedValue);
          setValue(
            numberValue === -1 && !acceptMinusOne ? undefined : numberValue,
          );
        }}
      />
    </NestWrapper>
  );
}
