import { getImageUrl, ICONS, stopPropagation } from "@repo/lib";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Header, HomeBg } from "../Home";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  title: string;
  cover?: boolean;
}

export default function Modal({
  children,
  closeModal,
  title,
  cover = true,
}: ModalProps) {
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
    <div className="absolute w-full h-full top-0 z-20">
      {cover ? (
        <>
          <div className="w-full h-full bg-slate-700 opacity-80 absolute"></div>
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            {/* <div className="w-full max-w-[700px] absolute left-1/2 -translate-x-1/2 top-0">
              <img
                src={getImageUrl(ICONS, "cross.svg")}
                className="absolute right-0 max-[700px]:right-8 top-4 w-8 h-8 cursor-pointer"
                onClick={closeModal}
              />
            </div> */}
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </div>,
    home
  );
}

interface CoverModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

export function CoverModal({ children, closeModal }: CoverModalProps) {
  return (
    <>
      <HomeBg />

      <div className="w-full h-full relative flex flex-col gap-4">
        <Header />
        <div className="relative w-full h-full px-8">
          <img
            src={getImageUrl(ICONS, "cross.svg")}
            className="absolute top-0 right-8 w-8 h-8 cursor-pointer"
            onClick={closeModal}
          />
          {children}
        </div>
      </div>
    </>
  );
}

interface BackgroundModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

export function BackgroundModal({
  children,
  closeModal,
}: BackgroundModalProps) {
  return (
    <>
      <div className="w-full h-full absolute bg-slate-900 opacity-80" />
      <div className="w-full h-full absolute flex justify-center items-center gap-8 flex-col">
        <img
          src={getImageUrl(ICONS, "/cross.svg")}
          className="absolute top-16 right-8 w-8 h-8 cursor-pointer"
          onClick={stopPropagation(closeModal)}
        />
        {children}
      </div>
    </>
  );
}

interface BoxModalProps {
  children: React.ReactNode;
  width?: string;
}

export function BoxModal({ children, width = "w-9" }: BoxModalProps) {
  return (
    <div
      className={`
        " justify-center items-center relative h-9 rounded-sm z-20 bg-blue-600 flex border-[1px] border-opacity-70 border-blue-950 drop-shadow-lg  shadow-sky-900 shadow-2xl",
        ${width}
      `}
    >
      <div className="absolute w-full h-8 rounded-sm bg-blue-500 -z-10">
        <div className=" rounded-sm w-full h-4 bg-blue-300 bg-opacity-30 mt-[2px] mx-auto" />
      </div>
      {children}
    </div>
  );
}
