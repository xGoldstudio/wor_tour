import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home from "./home/Home";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import useDataStore from "./cards/DataStore";
import { EditionModeProvider } from "./home/pages/deck/context/EditionModeContext";
import usePlayerStore from "./home/store/playerStore/playerStore";
import { _warningResetPlayStore } from "./home/store/initAllClientData";
import DebugPanel from "./DebugPanel";
import ErrorBoundary from "./ErrorBoundary";
import { EditorData } from "@repo/lib";

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
  const { init } = useDataStore((state) => ({
    init: state.init,
  }));
  const data = useQuery(
    "repoData",
    () => fetch("http://localhost:3000/").then((res) => res.json()),
    {
      onSuccess: (stringData) => {
        const objectData = JSON.parse(stringData) as EditorData;
        init(objectData);
        if (!usePlayerStore.getState().isInit) {
          _warningResetPlayStore();
        }
      },
      staleTime: 2200000,
    }
  );

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-black w-screen h-screen">
          <h1 className="text-white">Something went wrong.</h1>
          <DebugPanel />
        </div>
      }
    >
      <div id="app" className="select-none">
        {isInGame ? (
          <Game />
        ) : (
          <EditionModeProvider>
            <Home />
          </EditionModeProvider>
        )}
      </div>
    </ErrorBoundary>
  );
}
