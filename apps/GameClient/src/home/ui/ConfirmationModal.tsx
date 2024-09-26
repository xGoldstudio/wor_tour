import { Button } from "@repo/ui";
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
          {children}
          <div className="w-full max-w-[500px] flex gap-8">
            <Button
              action={() => {
                onConfirm();
                closeModal();
              }}
              full
            >
              Yes
            </Button>
            <Button action={closeModal} rarity="common" className="text-white" full>No</Button>
          </div>
        </div>
      </BackgroundModal>
    </Modal>
  );
}
