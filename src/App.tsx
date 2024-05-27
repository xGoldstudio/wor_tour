import Game from "./game/Game";
import useGameMetadataStore from "./game/stores/gameMetadataStore";
import Home from "./home/Home";

export default function App() {
  const { isInGame } = useGameMetadataStore(state => ({ isInGame: state.isInGame }));

  return isInGame ? <Game /> : <Home />;
}
