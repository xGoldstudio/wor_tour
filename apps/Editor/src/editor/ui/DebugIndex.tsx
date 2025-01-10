import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui";

export default function DebugIndex({ components, title }: { components: [string, React.FunctionComponent][], title: string }) {
  const navigate = useNavigate();

  return (
    <div className="w-full pt-8 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold pb-16">{title}</h1>
      {components.map(([name]) => (
        <Button action={() => navigate(name.toLowerCase())} className="w-[200px]">
          {name}
        </Button>
      ))}
    </div>
  );
}
