import { Button } from "@/home/Home";
import useEditorStore from "../store/EditorStore";
import { useNavigate } from "react-router-dom";
import ImageManager from "../utils/ImageManager";

export const imageManager = ImageManager();

export default function Editor() {
  const { worlds } = useEditorStore((state) => ({
    worlds: state.worlds,
  }));
  const navigate = useNavigate();

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center pt-8 gap-4">
      <Button action={() => navigate("/editor/worlds")}>Worlds ({worlds.length})</Button>
    </div>
  );
}
