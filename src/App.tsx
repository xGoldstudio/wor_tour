import CardEditor from "./cardEditor/CardEditor";
import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home from "./home/Home";

export default function App() {
  const { isInGame } = useGameMetadataStore(state => ({ isInGame: state.isInGame }));

  const url = new URL(window.location.href);
  const path = url.pathname;

  if (path === "/editor") {
    return <CardEditor />;
  }

  return isInGame ? <Game /> : <Home />;
}
