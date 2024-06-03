import { Box, Button } from "@repo/ui";
import Modal, { BackgroundModal } from "./modal";

interface ConfirmationModalProps {
  closeModal: () => void;
  isOpen: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function ConfirmationModal({
  closeModal,
  isOpen,
  onConfirm,
  children,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <Modal closeModal={closeModal} title={"confirmation"}>
      <BackgroundModal closeModal={closeModal}>
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
          <Box>{children}</Box>
          <div className="flex gap-16">
            <Button
              action={() => {
                onConfirm();
                closeModal();
              }}
            >
              Yes
            </Button>
            <Button action={closeModal}>No</Button>
          </div>
        </div>
      </BackgroundModal>
    </Modal>
  );
}
