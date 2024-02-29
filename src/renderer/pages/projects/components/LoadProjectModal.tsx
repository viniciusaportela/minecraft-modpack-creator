import {
  Button,
  Code,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { ipcRenderer, OpenDialogOptions } from 'electron';
import { Folder } from '@phosphor-icons/react';
import { useState } from 'react';

interface LoadProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPressLoad: (path: string) => void;
}

export default function LoadProjectModal({
  isOpen,
  onOpenChange,
  onPressLoad,
}: LoadProjectModalProps) {
  const [folderPath, setFolderPath] = useState('');

  const openFileDialog = async () => {
    const res = await ipcRenderer.invoke('openDialog', {
      title: 'Select a folder',
      properties: ['openDirectory'],
    } as OpenDialogOptions);

    if (res.canceled) return;

    setFolderPath(res.filePaths[0]);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Load Project
            </ModalHeader>
            <ModalBody>
              <span>
                Insert your modpack folder (<Code>.minecraft</Code> or your{' '}
                <b>CurseForge Modpack</b> folder)
              </span>
              <div className="flex">
                <Input
                  size="sm"
                  value={folderPath}
                  onValueChange={setFolderPath}
                  classNames={{ inputWrapper: 'h-10', mainWrapper: 'mr-2' }}
                />
                <Button isIconOnly onPress={openFileDialog}>
                  <Folder />
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={!folderPath}
                variant="solid"
                color="primary"
                onPress={() => onPressLoad(folderPath)}
              >
                Load
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
