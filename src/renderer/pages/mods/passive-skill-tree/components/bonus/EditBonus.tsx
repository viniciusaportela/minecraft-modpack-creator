import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
} from '@nextui-org/react';
import { Key, useEffect } from 'react';
import get from 'lodash.get';
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
      <Dropdown size="lg" shouldBlockScroll={false}>
        <DropdownTrigger>
          <Button variant="bordered" className="min-h-[42px]">
            {bonus.type}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          items={ALL_BONUSES.map((bonus) => ({ key: bonus, label: bonus }))}
          selectedKeys={[bonus.type]}
          onAction={onSelect}
          classNames={{
            base: 'h-60 overflow-y-auto',
          }}
        >
          {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
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
