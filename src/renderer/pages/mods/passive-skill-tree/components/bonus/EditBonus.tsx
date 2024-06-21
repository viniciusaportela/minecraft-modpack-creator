import {
  Autocomplete,
  AutocompleteItem,
  ScrollShadow,
} from '@nextui-org/react';
import { Key } from 'react';
import {
  ALL_BONUSES,
  COMPONENTS_BY_BONUS,
  EBonus,
  ReadableByBonus,
} from '../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { useModConfigSelector } from '../../../../../store/hooks/use-mod-config-selector';

interface BonusPageProps {
  onSelect: (key: Key) => void;
  selectedBonusPath: string[];
}

export default function EditBonus({
  selectedBonusPath,
  onSelect,
}: BonusPageProps) {
  const [bonus] = useModConfigSelector(selectedBonusPath);

  return (
    <ScrollShadow className="flex flex-col no-scrollbar">
      <Autocomplete
        selectedKey={bonus.type}
        size="sm"
        onSelectionChange={(key) => {
          if (key) {
            onSelect(key);
          }
        }}
        isClearable={false}
        defaultItems={ALL_BONUSES.map((b) => ({ label: b, value: b }))}
      >
        {(item) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
      <span className="font-bold mt-3 mb-2">
        {ReadableByBonus[bonus.type as EBonus] ?? bonus.type}
      </span>
      <div className="flex gap-2 flex-col">
        {COMPONENTS_BY_BONUS()[bonus.type as EBonus]({
          path: selectedBonusPath,
        })}
      </div>
    </ScrollShadow>
  );
}
