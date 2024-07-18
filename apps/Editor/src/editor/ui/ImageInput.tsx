import { useRef } from "react";
import ImageManager from "../utils/ImageManager";
import { getImageUrl } from "@repo/lib";

interface ImageInputProps {
  setImage: (imageUrl: string | null) => void;
  fileName: string | null;
  targetName: string;
}

export default function ImageInput({
  setImage,
  fileName,
  targetName,
}: ImageInputProps) {
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
          const fileName = await ImageManager().addImage(
            v.target.files![0],
            targetName
          );
          setImage(`${fileName}`);
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
