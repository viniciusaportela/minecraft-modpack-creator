import { Modal, ModalBody, ModalContent, Progress } from '@nextui-org/react';

interface BuildingModalProps {
  progress: number;
  progressText: string;
  totalProgress: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function BuildingModal({
  progress,
  totalProgress,
  progressText,
  isOpen,
  onOpenChange,
}: BuildingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className="py-5">
          <span className="-mb-2">{progressText}</span>
          <Progress
            value={(progress / totalProgress) * 100}
            size="sm"
            className="h-2"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
