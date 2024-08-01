import { Button } from "@repo/ui";
import { Link } from "react-router-dom";

const links = ["Worlds", "Debug"];

export default function AppEditorIndex() {
  return (
    <div className="w-full pt-8 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl font-bold pb-16">WORT Editor</h1>
      {links.map((name) => (
        <Link to={`${name.toLowerCase()}`} className="w-[200px]" key={name}>
          <Button action={() => {}} full>
            {name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
