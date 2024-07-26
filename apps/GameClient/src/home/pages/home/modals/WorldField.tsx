import { getImageUrl } from "@repo/lib";
import Field from "./Field";
import { World } from "@/cards/DataStore";

export default function WorldField({ world }: { world: World }) {
  return (
    <Field>
      <img
        className="w-[32px] aspect-square relative"
        src={getImageUrl(world.illustration)}
      />
      <p className="relative font-semibold">World {world.id}</p>
    </Field>
  );
}
