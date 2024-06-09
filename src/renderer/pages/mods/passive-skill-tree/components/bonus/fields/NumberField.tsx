import { Input } from '@nextui-org/react';
import get from 'lodash.get';
import set from 'lodash.set';
import Label from './Label';
import { useModConfigStore } from '../../../../../../store/hooks/use-mod-config-store';
import { ISkillTreeConfig } from '../../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';

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
    <>
      <Label>{label}</Label>
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
    </>
  );
}
