import { useRef } from "react";
import ImageManager from "../utils/ImageManager";
import { getImageUrl } from "@/game/gui/card/utils/getImageUrl";

interface ImageInputProps {
  setImage: (imageUrl: string | null) => void;
  fileName: string | null;
}

export default function ImageInput({ setImage, fileName }: ImageInputProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        ref={imageInputRef}
        onChange={async (v) => {
          const file = v.target.files![0];
          if (!file) return;
          setImage(await ImageManager().addImage(v.target.files![0]));
        }}
      />
      <div
        className="border-2 border-black rounded-md p-2 bg-white flex justify-center hover:border-blue-300"
        onClick={() => imageInputRef.current?.click()}
      >
        <img src={getImageUrl(fileName)} className="w-[64px] h-min" />
      </div>
    </>
  );
}
