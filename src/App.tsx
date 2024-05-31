import CardEditor from "./cardEditor/CardEditor";
import Editor from "./cardEditor/Editor";
import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home, { Button } from "./home/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import useEditorStore, { EditorData } from "./cardEditor/EditorStore";
import useDataStore from "./cards/DataStore";

const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function AppRouter() {
  const { isInGame } = useGameMetadataStore((state) => ({
    isInGame: state.isInGame,
  }));
  const { initData } = useEditorStore((state) => ({
    initData: state.initData,
  }));
  const { init } = useDataStore((state) => ({
    init: state.init,
  }));
  const data = useQuery(
    "repoData",
    () => fetch("http://localhost:3000/").then((res) => res.json()),
    {
      onSuccess: (stringData) => {
        const objectData = JSON.parse(stringData) as EditorData;
        initData(objectData);
        init(objectData);
      },
      staleTime: 2200000,
    }
  );

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isInGame ? <Game /> : <Home />} />
      <Route path="/editor" element={<EditorLayout />}>
        <Route path="/editor" element={<Editor />} index />
        <Route path="/editor/:cardId" element={<CardEditor />} />
      </Route>
    </Routes>
  );
}

function EditorLayout() {
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
      {isEditorStale && (
        <div className="fixed bg-slate-200 left-1/2 -translate-x-1/2 bottom-8 py-4 w-[800px] flex items-center gap-4 justify-center rounded-md">
          <p>Modifications has not been saved</p>
          <Button
            action={() => mutation.mutate()}
            disabled={mutation.isLoading}
            rarity="epic"
          >
            Save
          </Button>
          <Button
            action={() => mutation.mutate()}
            disabled={mutation.isLoading}
          >
            Reset state
          </Button>
        </div>
      )}

      <Outlet />
    </>
  );
}
