import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Header } from "../Home";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  title: string;
}

export default function Modal({ children, closeModal, title }: ModalProps) {
  useEffect(() => {
		function keyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				closeModal();
			}
		}
		history.pushState({}, "_", `#${title}`);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("popstate", closeModal);

    return () => {
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("popstate", closeModal);
      history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    };
  });

  const home = document.getElementById("home");

  if (!home) return null;

  return createPortal(
    <div className="absolute w-full h-full top-0">
      <div className="absolute bg-slate-900 opacity-25 w-full h-full"></div>
      <div className="w-full h-full relative bg-slate-300 flex flex-col gap-4">
        <Header />
        <div className="relative w-full h-full px-8">
          <img
            src="/cross.svg"
            className="absolute top-0 right-8 w-8 h-8 cursor-pointer"
            onClick={closeModal}
          />
          {children}
        </div>
      </div>
    </div>,
    home
  );
}
