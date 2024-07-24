import DebugPanelLayout from "./DebugPanelLayout";
import { useRunInstance } from "./useRunGameInstance";

export default function ManaBarDebug() {
  const instance = useRunInstance(false);

  return (
    <div>
      <div className="w-full flex justify-center items-center pt-16 gap-32">
        <DebugPanelLayout instance={instance}>
          <p className="text-2xl font-semibold">Basic operations</p>
          <div className="flex gap-4"></div>
        </DebugPanelLayout>
      </div>
    </div>
  );
}
