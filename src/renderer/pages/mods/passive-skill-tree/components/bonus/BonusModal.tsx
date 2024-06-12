import {
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Selection,
} from '@nextui-org/react';
import get from 'lodash.get';
import set from 'lodash.set';
import React, { Key, useState } from 'react';
import { Plus, X } from '@phosphor-icons/react';
import { Page, Pager } from '../../../../../components/pager/Pager';
import { useErrorHandler } from '../../../../../core/errors/hooks/useErrorHandler';
import { AllAttributes } from './bonuses/AllAttributes';
import EditBonus from './EditBonus';
import {
  COMPONENTS_BY_BONUS,
  EBonus,
} from '../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { useModConfigSelector } from '../../../../../store/hooks/use-mod-config-selector';
import { ISkillTreeConfig } from '../../../../../core/domains/mods/skilltree/interfaces/skill-tree-config.interface';
import { useModConfigStore } from '../../../../../store/hooks/use-mod-config-store';

interface BonusModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  focusedNodePath: string[];
}

export default function BonusModal({
  isOpen,
  onOpenChange,
  focusedNodePath,
}: BonusModalProps) {
  const handleError = useErrorHandler();

  const store = useModConfigStore<ISkillTreeConfig>();
  const [bonuses] = useModConfigSelector<any[]>([
    ...focusedNodePath,
    'data',
    'bonuses',
  ]);

  const [page, setPage] = useState(bonuses?.length ? 'bonus-0' : 'empty');

  const onSelectKey = (index: number, key: Key) => {
    const defaultConfig =
      COMPONENTS_BY_BONUS()[key as EBonus].getDefaultConfig() ??
      AllAttributes.getDefaultConfig();

    store.setState((state) => {
      set(state, [...focusedNodePath, 'data', 'bonuses', index], {
        ...defaultConfig,
      });
    });
  };

  const createPages = () => {
    return bonuses?.map((bonus, index) => (
      <Page name={`bonus-${index}`}>
        <EditBonus
          selectedBonusPath={[
            ...focusedNodePath,
            'data',
            'bonuses',
            String(index),
          ]}
          onSelect={(key) => onSelectKey(index, key)}
        />
      </Page>
    ));
  };

  const addBonus = async () => {
    try {
      const defaultConfig = AllAttributes.getDefaultConfig();

      store.setState((state) => {
        set(
          state,
          [...focusedNodePath, 'data', 'bonuses'],
          [
            ...bonuses,
            {
              ...defaultConfig,
            },
          ],
        );
      });

      if (page === 'empty') {
        setPage('bonus-0');
      }
    } catch (err) {
      if (err instanceof Error) {
        await handleError(err);
      }
    }
  };

  const deleteBonus = (index: number) => {
    store.setState((state) => {
      const curBonuses = get(state, [...focusedNodePath, 'data', 'bonuses']);
      curBonuses.splice(index, 1);
    });
  };

  const onClickBonus = (key: Selection) => {
    setPage(Array.from(key as Set<Key>)[0] as string);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="pb-2 px-3">
          <div className="w-60 mr-4 flex">
            <span>Bonuses</span>
            <Button
              color="primary"
              size="sm"
              className="w-10 ml-auto"
              onPress={addBonus}
            >
              <Plus />
            </Button>
          </div>
          <span className="px-4">Edit Bonus</span>
        </ModalHeader>
        <ModalBody className="px-3">
          <div className="flex h-[420px] gap-8">
            <div className="flex flex-col w-60">
              {bonuses?.length > 0 ? (
                <ScrollShadow>
                  <Listbox
                    onSelectionChange={onClickBonus}
                    disallowEmptySelection
                    itemClasses={{
                      base: 'data-[selected=true]:bg-zinc-700',
                    }}
                    classNames={{
                      base: 'p-0',
                    }}
                    selectionMode="single"
                    selectedKeys={[page]}
                    hideSelectedIcon
                  >
                    {bonuses.map((bonus, index) => (
                      <ListboxItem
                        key={`bonus-${index}`}
                        endContent={
                          <Button
                            isIconOnly
                            size="sm"
                            className="ml-auto"
                            variant="light"
                            onPress={() => deleteBonus(index)}
                          >
                            <X />
                          </Button>
                        }
                      >
                        {bonus.type}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </ScrollShadow>
              ) : (
                <div className="flex-1 items-center justify-center">
                  <span className="italic">No bonuses added</span>
                </div>
              )}
            </div>
            <Divider
              orientation="vertical"
              className="absolute top-0 bottom-0 left-[268px]"
            />
            <div className="flex flex-col flex-1 w-0">
              <Pager
                page={page}
                initialPage={page}
                onPageChange={setPage}
                key={`${bonuses?.[page.match(/(\d+)/)?.[1] || 0]?.type}`}
              >
                <Page name="empty" />
                {createPages()}
              </Pager>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
