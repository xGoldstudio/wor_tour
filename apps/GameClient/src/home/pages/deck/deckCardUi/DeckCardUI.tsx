import {
  Button,
  CARD_BORDER_HEIGHT,
  CARD_BORDER_WIDTH,
  cn,
  useOnClickOutside,
} from "@repo/ui";
import React, { useContext, useEffect, useState } from "react";
import CardModal from "../CardModal";
import { PlayerCardCollectionInfo } from "../cardFilters";
import { useEditionMode } from "../context/UseEditionMode";
import { useEditDeckActions } from "../context/EditionModeContext";
import Draggable from "../dragAndDrop/Draggable";
import { DragContext, DragContextType } from "../dragAndDrop/DragContext";
import ContentCardDeckUi from "./ContentCardDeckUi";
import { cardsAddingAnimationService } from "@/services/inject";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export interface CardUIProps {
  card: PlayerCardCollectionInfo;
  size: number;
  isDeckCard?: boolean;
  parentScrollRef?: React.RefObject<HTMLDivElement>;
}

export function DeckCardUI({
  card,
  size,
  isDeckCard,
  parentScrollRef,
}: CardUIProps) {
  const { replaceCard } = useEditDeckActions();
  const { setEditionMode } = useEditionMode();
  const { replacingCard, setReplacingCard } = useEditionMode();

  useEffect(() => {
    const potentialAnimation =
      cardsAddingAnimationService.consumeCardAddingAnimation(card.id);
    if (!potentialAnimation || !dragRef.current) {
      return;
    }
    const { x, y } = dragRef.current.getBoundingClientRect();
    const diffX = potentialAnimation.x - x;
    const diffY = potentialAnimation.y - y;
    addingAnimation(diffX, diffY)();
  });

  const { contextSafe } = useGSAP();
  const addingAnimation = (diffX: number, diffY: number) =>
    contextSafe(() => {
      if (!dragRef.current) {
        return;
      }
      dragRef.current.style.zIndex = "1000";
      gsap.fromTo(
        dragRef.current,
        { x: diffX, y: diffY },
        {
          x: 0,
          y: 0,
          duration: 0.5,
          onComplete: () => dragRef.current?.removeAttribute("style"),
        }
      );
    });

  const { startDragging, isDragging } = useContext(
    DragContext
  ) as DragContextType<number>;
  const dragRef = React.useRef<HTMLDivElement>(null);

  function onDragEnd() {
    setReplacingCard((v) => {
      if (v === true) {
        return null;
      }
      return v;
    });
  }

  const isDraggable = replacingCard;

  return (
    <Draggable
      disabled={!isDraggable}
      dragData={card.id}
      dragRef={dragRef}
      onDragEnd={onDragEnd}
    >
      <CollectionCardUI
        card={card}
        size={size}
        parentScrollRef={parentScrollRef}
        isShaking={!!replacingCard && isDeckCard}
        isSelectable={!replacingCard}
        onLongPress={
          isDraggable
            ? undefined
            : (e) => {
                if (!replacingCard) {
                  setReplacingCard(true);
                  setEditionMode(true);
                  startDragging(e, card.id, dragRef, { onDragEnd });
                }
              }
        }
        onAction={() => {
          if (isDragging.current) {
            return false;
          }
          if (isDeckCard && replacingCard) {
            replaceCard(card.id);
          }
          return true;
        }}
        onSelectedChange={(next) => {
          setEditionMode(next);
        }}
      />
    </Draggable>
  );
}

export interface CollectionCardUiProps {
  card: PlayerCardCollectionInfo;
  size: number;
  parentScrollRef?: React.RefObject<HTMLDivElement>;
  onLongPress?: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent
  ) => void;
  onAction?: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent
  ) => boolean;
  isShaking?: boolean;
  onSelectedChange?: (next: boolean) => void;
  isSelectable?: boolean;
}

export function CollectionCardUI({
  card,
  size,
  parentScrollRef,
  onLongPress,
  onAction,
  isShaking,
  onSelectedChange,
  isSelectable,
}: CollectionCardUiProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  useEffect(() => {
    if (isSelectable === false) {
      setIsSelected(false);
    }
  }, [isSelectable]);

  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  useOnClickOutside(wrapperRef, () => setIsSelected(false), {
    watching: isSelected,
  });

  function onSelected() {
    if (!parentScrollRef?.current || !wrapperRef.current) {
      return;
    }
    const threshold = 30;
    const top =
      wrapperRef.current.getBoundingClientRect().top +
      parentScrollRef.current.scrollTop -
      parentScrollRef.current.getBoundingClientRect().top -
      threshold;
    const bottom =
      wrapperRef.current.getBoundingClientRect().bottom +
      parentScrollRef.current.scrollTop -
      parentScrollRef.current.getBoundingClientRect().top +
      threshold +
      90;
    if (top < parentScrollRef.current.scrollTop) {
      parentScrollRef.current.scrollTo({
        top: top,
        behavior: "smooth",
      });
    } else if (
      bottom >
      parentScrollRef.current.scrollTop + parentScrollRef.current.clientHeight
    ) {
      parentScrollRef.current.scrollTo({
        top: bottom - parentScrollRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div
        className={cn("relative", isSelected && "z-50")}
        style={{
          width: `${size * CARD_BORDER_WIDTH}px`,
          height: `${size * CARD_BORDER_HEIGHT}px`,
        }}
        id={cardsAddingAnimationService.getCollectionCardId(card.id)}
      >
        <Button
          innerRef={wrapperRef}
          unstyled
          dontPreventPropagation
          onLongPressAction={onLongPress}
          action={(e) => {
            if (onAction) {
              const shouldContinue = onAction(e);
              if (!shouldContinue) {
                return;
              }
            }
            if (card.lockLabel !== null) {
              setIsDescriptionOpen(true);
              return;
            }
            if (isSelectable === false) return;
            setIsSelected((x) => {
              const next = !x;
              if (next) {
                onSelected();
              }
              onSelectedChange?.(next);
              return next;
            });
          }}
        >
          <ContentCardDeckUi
            card={card}
            size={size}
            isSelected={isSelected}
            setIsDescriptionOpen={setIsDescriptionOpen}
            isShaking={isShaking}
          />
        </Button>
      </div>
    </>
  );
}
