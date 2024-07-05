import Ribbon from "@/home/ui/Ribbon";
import Modal from "@/home/ui/modal";
import { Box } from "@repo/ui";
import ScrollContainer from "react-indiana-drag-scroll";

interface WorldModalProps {
  closeModal: () => void;
}

export default function WorldModal({ closeModal }: WorldModalProps) {
  return (
    <Modal title="profile" closeModal={closeModal}>
      <div className="w-full h-full bg-slate-900 opacity-80 absolute"></div>
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <Box rarity="epic" height={450} width={600} size={1.5}>
          <img
            src="/cross.svg"
            className="absolute top-3 right-3 w-8 h-8 cursor-pointer z-10 drop-shadow-[2px_1px_1px_black]"
            onClick={closeModal}
          />
          <div
            className="w-full h-full absolute brightness-75 top-0 left-0"
            style={{
              backgroundImage: "url('/homeBg.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <ScrollContainer className="w-full h-full flex">
            <div className="w-full h-max flex flex-col items-center relative pb-8">
							<Ribbon className="px-16">World Unlock Reward</Ribbon>
							<p>Blablalba</p>
              <Ribbon className="px-16">Chests Unlocked</Ribbon>
							<p>chest</p>
							<p>chest</p>
							<p>chest</p>
              <p>Gold per victory: 50 (max 5000)</p>
            </div>
          </ScrollContainer>
        </Box>
      </div>
    </Modal>
  );
}
