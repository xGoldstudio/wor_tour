import { Button } from "@/home/Home";
import useEditorStore from "./EditorStore";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from 'lucide-react';

export default function Editor() {
  const { cards, addCard, deleteCard } = useEditorStore((state) => ({
    cards: state.cards,
    addCard: state.addCard,
    deleteCard: state.deleteCard,
  }));
  const navigate = useNavigate();

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center pt-8 gap-4">
      <h3 className="text-2xl font-bold">Cards:</h3>
      <div className="flex flex-col bg-slate-200 rounded-md p-4 w-[400px] items-center">
        {cards.map((card) => (
          <div className="py-1 flex gap-4 items-center">
            <Link
              to={`/editor/${card.id}`}
              className="hover:underline decoration-solid "
            >
              {card.id} - {card.name}
            </Link>
            <Button action={() => deleteCard(card.id)} small>
              <Trash2 color="red" size={16} className="my-1"/>
            </Button>
          </div>
        ))}
      </div>
      <Button
        action={() => {
          const id = addCard();
          navigate(`/editor/${id}`);
        }}
      >
        New card
      </Button>
    </div>
  );
}
