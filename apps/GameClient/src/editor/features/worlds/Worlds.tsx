import { Button } from "@/home/Home";
import useEditorStore from "../../store/EditorStore";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function WorldsEditor() {
  const { worlds, addWorld, removeWorld } = useEditorStore((state) => ({
    worlds: state.worlds,
    addWorld: state.addWorld,
    removeWorld: state.removeLastWorld,
  }));

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center pt-8 gap-4">
      <h3 className="text-2xl font-bold">Worlds:</h3>
      <div className="flex flex-col bg-slate-200 rounded-md p-4 w-[400px] items-center">
        {worlds.map((world) => (
          <div
            className="py-1 flex gap-4 items-center justify-between w-full"
            key={world.id}
          >
            <Link
              to={`/editor/worlds/${world.id}`}
              className="hover:underline decoration-solid py-1"
            >
              {world.id}: {world.name}
            </Link>
            {world.id === worlds.length && (
              <Button action={() => removeWorld(world.id)} small>
                <Trash2 color="red" size={16} className="my-1" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button action={addWorld}>Add world</Button>
    </div>
  );
}
