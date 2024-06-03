import { Button } from "@repo/ui";
import useEditorStore from "../store/EditorStore";
import { useNavigate } from "react-router-dom";

export default function Editor() {
  const { worlds } = useEditorStore((state) => ({
    worlds: state.worlds,
  }));
  const navigate = useNavigate();

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center pt-8 gap-4">
      <Button action={() => navigate("/editor/worlds")}>
        Worlds ({worlds.length})
      </Button>
    </div>
  );
}
