import { Link } from "react-router-dom";
import { Button } from "@repo/ui";
import { DebugComponents } from "./DebugComponents";

export default function DebugIndex() {
  return (
    <div className="w-full pt-8 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold pb-16">Debug Components</h1>
      {DebugComponents.map(([name]) => (
        <Link to={`${name.toLowerCase()}`} className="w-[200px]" key={name}>
          <Button action={() => {}} full>
            {name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
