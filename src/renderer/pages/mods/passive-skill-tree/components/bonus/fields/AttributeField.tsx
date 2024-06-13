import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import Label from './Label';
import { useModConfigSelector } from '../../../../../../store/hooks/use-mod-config-selector';
import { useAttributesStore } from '../../../../../../store/attributes.store';
import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';

export const AttributeField: FunctionWithDefaultConfig = ({ path }) => {
  const [value, setValue] = useModConfigSelector(path);

  const attributes = useAttributesStore((st) => st.attributes);

  return (
    <>
      <Label nestLevel={path.length} path={path}>
        Attribute
      </Label>
      <Autocomplete
        value={value}
        onSelectionChange={(key) => setValue(key)}
        defaultItems={attributes}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
};

AttributeField.getDefaultConfig = () => {
  return 'minecraft:generic.armor';
};
