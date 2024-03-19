import { Input } from '@nextui-org/react';
import { useEffect } from 'react';
import { useModConfig } from '../../../../../../hooks/use-mod-config';
import Label from './Label';
import { useModConfigStore } from '../../../../../../store/mod-config.store';

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
  const pathWithoutLastPiece = path.slice(0, -1);
  const [value, setValue] = useModConfig(path);

  console.log(useModConfigStore.getState());

  useEffect(() => {
    console.log('NumberField first render', pathWithoutLastPiece, path, value);
  }, []);

  console.log('NumberField', path, value);

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
            parseFloat(newValue.replace(',', '.')) === -1 && !acceptMinusOne
              ? undefined
              : newValue,
          )
        }
      />
    </>
  );
}
