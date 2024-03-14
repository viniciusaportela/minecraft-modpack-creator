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
import React, { Key, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Page, Pager } from '../../../../../components/pager/Pager';
import { useErrorHandler } from '../../../../../core/errors/hooks/useErrorHandler';
import { useModConfigByPath } from '../../../../../hooks/use-mod-config';

interface BonusModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  focusedNodePath: string;
}

export default function BonusModal({
  isOpen,
  onOpenChange,
  focusedNodePath,
}: BonusModalProps) {
  const handleError = useErrorHandler();
  const [focusedNode, setFocusedNode] = useModConfigByPath(focusedNodePath);

  const [page, setPage] = useState(
    focusedNode.data.bonuses.length ? 'bonus-0' : 'empty',
  );

  const createPages = () => {
    return [];
    // return bonuses.map((bonus, index) => (
    //   <Page key={index} name={`bonus-${index}`}>
    //     <EditBonus
    //       selectedBonus={bonus.getTypeValue()}
    //       onSelectionChange={() => {
    //         console.log('selection changed');
    //       }}
    //       fields={bonus}
    //     />
    //   </Page>
    // ));
  };

  const addBonus = async () => {
    try {
      // DEV
    } catch (err) {
      await handleError(err);
    }
  };

  const onClickBonus = (key: Selection) => {
    console.log('key', key);
    setPage(Array.from(key as Set<Key>)[0] as string);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="pb-2">
          <div className="w-60 mr-4 flex">
            <span>Bonuses</span>
            <Button
              color="primary"
              size="sm"
              className="w-10 ml-auto mr-2"
              onPress={addBonus}
            >
              <Plus />
            </Button>
          </div>
          <span className="px-4">Edit Bonus</span>
        </ModalHeader>
        <ModalBody className="px-3">
          <div className="flex h-52">
            <div className="flex flex-col w-60">
              {focusedNode.data.bonuses.length > 0 ? (
                <ScrollShadow>
                  <Listbox
                    onSelectionChange={onClickBonus}
                    selectionMode="single"
                    selectedKeys={page}
                  >
                    {focusedNode.data.bonuses.map((bonus, index) => (
                      <ListboxItem key={`bonus-${index}`}>
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
              className="mt-[-72px] h-[calc(100%+80px)] mx-4"
            />
            <div className="flex flex-col flex-1 w-0 px-2">
              <Pager page={page} initialPage={page} onPageChange={setPage}>
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
