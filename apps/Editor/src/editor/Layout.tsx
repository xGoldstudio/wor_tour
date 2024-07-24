import { useMutation } from "react-query";
import useEditorStore from "./store/EditorStore";
import { Button } from "@repo/ui";
import LightEditorLayout from "./LightLayout";

export default function EditorLayout({
  reloadData,
}: {
  reloadData: () => void;
}) {
  const { getEdtiorData, isEditorStale, removeStale } = useEditorStore(
    (state) => ({
      initData: state.initData,
      getEdtiorData: state.getEdtiorData,
      isEditorStale: state.isEditorStale,
      removeStale: state.removeStale,
    })
  );
  const mutation = useMutation({
    mutationFn: () =>
      fetch("http://localhost:3000/", {
        method: "POST",
        body: JSON.stringify(getEdtiorData()),
      }),
    onSuccess: () => removeStale(),
  });
  return (
    <>
      <LightEditorLayout />
      {isEditorStale && (
        <div className="fixed bg-slate-400 top-2 right-2 py-4 px-4 flex items-center gap-4 justify-center rounded-md z-10">
          <Button
            action={() => mutation.mutate()}
            disabled={mutation.isLoading}
            rarity="epic"
          >
            Save
          </Button>
          <Button action={() => reloadData()} disabled={mutation.isLoading}>
            Reset state
          </Button>
        </div>
      )}
    </>
  );
}
