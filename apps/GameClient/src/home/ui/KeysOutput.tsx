import { RessourceCounter } from "../Home";
import { keysService } from "../services/inject";
import { MAX_KEYS } from "../services/KeysService/KeysService";

export default function KeysOutput() {
  const keys = keysService.watchKeys();

  return (
    <div id="keysCount">
      <RessourceCounter
        amount={keys}
        max={MAX_KEYS}
        icon={
          <img
            id="keysCountIcon"
            src="/key.png"
            className="absolute z-10 left-[3px] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[32px] drop-shadow-[2px_1px_1px_black] rotate-[25deg] contrast-150"
          />
        }
        name="keys"
        timer="earnKey"
      />
    </div>
  );
}
