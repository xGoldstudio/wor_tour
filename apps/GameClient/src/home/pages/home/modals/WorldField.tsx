import { imageManagerService, World } from "@repo/ui";
import Field from "./Field";

export default function WorldField({ world }: { world: World }) {
  return (
    <Field>
      <img
        className="w-[32px] aspect-square relative"
        src={imageManagerService.getImage(world.illustration)}
      />
      <p className="relative font-semibold">World {world.id}</p>
    </Field>
  );
}
