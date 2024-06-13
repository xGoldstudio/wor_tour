import useEditorStore from "@/editor/store/EditorStore";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import ImageInput from "@/editor/ui/ImageInput";

export default function WorldEditor() {
  const { worldId: worldIdParam } = useParams();
  const navigate = useNavigate();

  const worldId = worldIdParam ? parseInt(worldIdParam) : undefined;

  const editorStore = useEditorStore((state) =>
    worldId !== undefined
      ? {
          world: state.getWorld(worldId),
          cards: state.getCardsByWorld(worldId),
          setWorld: state.setWorld(worldId),
        }
      : null
  );

  if (!editorStore || !editorStore.world) {
    navigate("/worlds");
    return;
  }

  const { world, cards, setWorld } = editorStore;

  return (
    <div className="w-full flex justify-center gap-8 pt-8">
      <div className="grid items-center grid-cols-[1fr_2fr] gap-2 flex-col p-4 bg-slate-200 rounded-md w-[400px] h-min">
        <label>Name:</label>
        <input
          value={world.name}
          onChange={(v) => setWorld({ name: v.target.value })}
          className="rounded-sm border-2 border-black p-2"
        />
        <label>Description:</label>
        <textarea
          value={world.description}
          onChange={(v) => setWorld({ description: v.target.value })}
          className="rounded-sm border-2 border-black p-2 min-h-32"
        />
        <label>Illustration:</label>
        <ImageInput
          setImage={(imageUrl) => setWorld({ illustration: imageUrl })}
          fileName={world.illustration}
          targetName={`world_${world.id}_illustration`}
        />
        <label>Card Background:</label>
        <ImageInput
          setImage={(imageUrl) => setWorld({ cardBackground: imageUrl })}
          fileName={world.cardBackground}
          targetName={`world_${world.id}_cardBackground`}
        />
      </div>

      <div className="flex flex-col bg-slate-200 rounded-md p-4 w-[400px] items-center">
        <h3 className="text-2xl font-bold">Cards:</h3>
        {cards.map((card) => (
          <div className="py-1 flex gap-4 items-start w-full">
            <Link
              to={`${card.id}`}
              className="hover:underline decoration-solid "
            >
              ({card.rarity}): {card.id} - {card.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}