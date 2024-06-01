import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home, { Button } from "./home/Home";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import useEditorStore from "./editor/store/EditorStore";
import useDataStore from "./cards/DataStore";
import WorldsEditor from "./editor/features/worlds/Worlds";
import { EditorData } from "./editor/type/type";
import WorldEditor from "./editor/features/worlds/World";
import CardEditor from "./editor/features/card/CardEditor";
import React from "react";
import Editor from "./editor/features/Editor";

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
      <Route path="/editor" element={<EditorLayout reloadData={data.refetch} />}>
        <Route path="/editor" element={<Editor />} index />
        <Route
          path="/editor/worlds/:worldId/:cardId"
          element={<CardEditor />}
        />
        <Route path="/editor/worlds" element={<WorldsEditor />} />
        <Route path="/editor/worlds/:worldId" element={<WorldEditor />} />
      </Route>
    </Routes>
  );
}

function EditorLayout({ reloadData }: { reloadData: () => void }) {
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
  const location = useLocation();
  const splitedPath = location.pathname.split("/").filter((x) => x !== "");

  return (
    <div className="">
      <div className="w-full py-2 bg-slate-200 flex gap-4 items-center justify-center">
        <div className="flex">
          {splitedPath.map((path, index) => (
            <React.Fragment key={index}>
              <Link
                key={index}
                className="text-xl hover:underline"
                to={[...splitedPath].splice(1, index).join("/")}
              >
                <span className="">{path}</span>
                {index !== splitedPath.length - 1 && (
                  <span className="text-lg px-2">/</span>
                )}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
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
            action={() => reloadData()}
            disabled={mutation.isLoading}
          >
            Reset state
          </Button>
        </div>
      )}
      <Outlet />
    </div>
  );
}
