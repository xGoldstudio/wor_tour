import {
  BrowserRouter, Route,
  Routes
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider, useQuery
} from "react-query";
import useEditorStore from "./editor/store/EditorStore";
import WorldsEditor from "./editor/features/worlds/Worlds";
import WorldEditor from "./editor/features/worlds/World";
import CardEditor from "./editor/features/card/CardEditor";
import Editor from "./editor/features/Editor";
import { EditorData } from "@repo/types";
import EditorLayout from "./editor/Layout";

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
    },
  );

  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<EditorLayout reloadData={data.refetch} />}
      >
        <Route path="/" element={<Editor />} index />
        <Route
          path="/worlds/:worldId/:cardId"
          element={<CardEditor />}
        />
        <Route path="/worlds" element={<WorldsEditor />} />
        <Route path="/worlds/:worldId" element={<WorldEditor />} />
      </Route>
    </Routes>
  );
}