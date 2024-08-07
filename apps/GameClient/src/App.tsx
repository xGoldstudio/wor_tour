import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home from "./home/Home";
import { BrowserRouter } from "react-router-dom";
import { EditionModeProvider } from "./home/pages/deck/context/EditionModeContext";
import DebugPanel from "./DebugPanel";
import ErrorBoundary from "./ErrorBoundary";
import LoadingScreen from "./LoadingScreen";
import { loadingService } from "@repo/ui";

export default function App() {
  const isLoaded = loadingService.useWatchIsLoaded();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

function AppRouter() {
  const { isInGame } = useGameMetadataStore((state) => ({
    isInGame: state.isInGame,
  }));

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-black w-screen h-screen">
          <h1 className="text-white">Something went wrong.</h1>
          <DebugPanel />
        </div>
      }
    >
      <div id="app">
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
