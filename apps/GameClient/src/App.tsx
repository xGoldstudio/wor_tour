import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home from "./home/Home";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import useDataStore from "./cards/DataStore";
import { EditorData } from "@repo/types";

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
      },
      staleTime: 2200000,
    }
  );

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return isInGame ? <Game /> : <Home />;
}
