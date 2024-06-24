import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import useEditorStore from "./editor/store/EditorStore";
import WorldEditor from "./editor/features/worlds/World";
import CardEditor from "./editor/features/card/CardEditor";
import { EditorData } from "@repo/types";
import EditorLayout from "./editor/Layout";
import Progression from "./editor/features/progression/Progression";

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
  const { initData } = useEditorStore((state) => ({
    initData: state.initData,
  }));
  const data = useQuery(
    "repoData",
    () => fetch("http://localhost:3000/").then((res) => res.json()),
    {
      onSuccess: (stringData) => {
        const objectData = JSON.parse(stringData) as EditorData;
        initData(objectData);
      },
      staleTime: 2200000,
    }
  );

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<EditorLayout reloadData={data.refetch} />}>
        <Route path="/" element={<Progression />} index />
        <Route path="/:worldId/:cardId" element={<CardEditor />} />
        <Route path="/:worldId" element={<WorldEditor />} />
      </Route>
    </Routes>
  );
}
