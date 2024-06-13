import { Input } from '@nextui-org/react';
import Label from './Label';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';
import { NestWrapper } from '../NestWrapper';

interface TextFieldProps {
  path: string[];
  label: string;
}

export const TextField = ({ path, label }: TextFieldProps) => {
  const [value, setValue] = useModConfigSelector(path);

  return (
    <NestWrapper nestLevel={path.length}>
      <Label nestLevel={path.length}>{label}</Label>
      <Input
        size="sm"
        classNames={{
          inputWrapper: 'px-3 py-1 h-10',
        }}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
        }}
      />
    </NestWrapper>
  );
};
