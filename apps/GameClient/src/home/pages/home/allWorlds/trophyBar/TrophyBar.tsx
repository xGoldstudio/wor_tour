import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ContextSafeFunc, useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AllWorldsAnimationContext, AllWorldsAnimationContextType } from "./TrophyBarContext";
import { getCenterOfBoundingElement, getImageUrl, ICONS, inPx } from "@repo/lib";
import { textureByRarity } from "@repo/ui";

export default function TrophyBar({
  numberOfTrophies,
  maxNumberOfTrophies,
  currentWorld,
}: {
  maxNumberOfTrophies: number;
  numberOfTrophies: number;
  currentWorld: number;
}) {
  const { addAppearedTrophiesField } = useContext(
    AllWorldsAnimationContext
  ) as AllWorldsAnimationContextType;
  const barRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<{
    trophiesFields: number[];
    currentWorldYPosition: number;
    trophiesBarHeight: number;
    maxTrophiesBarHeight: number;
    scrollContainer: HTMLDivElement | null;
    scrollDefaultPosition: number;
    wrapperContainer: HTMLDivElement | null;
  }>({
    trophiesFields: [],
    currentWorldYPosition: 0,
    trophiesBarHeight: 0,
    maxTrophiesBarHeight: 0,
    scrollContainer: null,
    scrollDefaultPosition: 0,
    wrapperContainer: null,
  });
  const [isTimelineOver, setIsTimelineOver] = useState(false);

  const bottomGap = 7;
  useLayoutEffect(() => {
    setState((state) => {
      const nextState = { ...state };
      const container = document.querySelector(
        ".allWorldsScrollerContainer"
      ) as HTMLDivElement;
      nextState.wrapperContainer = document.querySelector(".allWorlds");
      const scrollPosition = container?.scrollTop || 0;
      nextState.scrollContainer = container;
      nextState.trophiesFields = [
        ...document.querySelectorAll(".trophiesField"),
      ].map(
        (elt) =>
          scrollPosition + getCenterOfBoundingElement(elt as HTMLElement).y
      );
      nextState.currentWorldYPosition =
        scrollPosition +
        getCenterOfBoundingElement(`.worldFieldIllustration${currentWorld}`).y -
        getCenterOfBoundingElement("#worldIllustration").y;
      function getTrophiesPosition(trophies: number) {
        const index = Math.floor(trophies / 100) + 1;
        const prevPosition =
          nextState.trophiesFields[
            nextState.trophiesFields.length - index - 1
          ] ?? 0;
        const nextPosition =
          nextState.trophiesFields[nextState.trophiesFields.length - index] ??
          0;
        return (
          nextPosition -
          ((nextPosition - prevPosition) * (trophies % 100)) / 100
        );
      }
      const trophiesTargetYPosition = getTrophiesPosition(numberOfTrophies);
      const startTrophiesY =
        nextState.trophiesFields[nextState.trophiesFields.length - 1] ?? 0;
      nextState.trophiesBarHeight =
        startTrophiesY - trophiesTargetYPosition + bottomGap;
      nextState.maxTrophiesBarHeight =
        startTrophiesY - getTrophiesPosition(maxNumberOfTrophies) + bottomGap;
      nextState.scrollDefaultPosition =
        trophiesTargetYPosition -
        (nextState.scrollContainer?.getBoundingClientRect()?.height || 0) / 2; // position center of the screen
      return nextState;
    });
  }, [numberOfTrophies]);

  const startTrophiesY2 =
    state.trophiesFields[state.trophiesFields.length - 1] ?? 0;

  function getInnerBarStartingHeight() {
    const startScaleYTrophies = getCenterOfBoundingElement(
      `.worldField${currentWorld}`
    ).y;
    return (
      (startTrophiesY2 - startScaleYTrophies + bottomGap) /
      state.trophiesBarHeight
    );
  }

  const { contextSafe } = useGSAP(
    () => {
      if (!state.wrapperContainer || !state.scrollContainer) return;
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTimelineOver(true);
        },
      });

      // set opacity of allWorlds to 100
      tl.set(
        state.scrollContainer,
        {
          scrollTo: { y: 999999 },
        },
        "init"
      );
      tl.set(
        state.scrollContainer,
        {
          scrollTo: { y: state.currentWorldYPosition },
          onComplete: () =>
            setLevelsAppear(state.scrollContainer?.scrollTop ?? 0),
        },
        "opacity"
      );
      tl.fromTo(
        state.wrapperContainer,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        },
        "begin"
      );

      tl.fromTo(
        ".innerBar",
        {
          scaleY: getInnerBarStartingHeight(),
        },
        {
          scaleY: 1,
          duration: 1.2,
        },
        "begin"
      );
      tl.fromTo(
        state.scrollContainer,
        { scrollTo: state.currentWorldYPosition },
        {
          scrollTo: { y: state.scrollDefaultPosition },
          duration: 1.2,
          ease: "power2.inOut",
        },
        "begin"
      );
      tl.fromTo(
        ".innerBar",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        "begin"
      );
      tl.fromTo(
        ".innerMaxBar",
        {
          opacity: 0,
        },
        {
          opacity: 0.3,
          duration: 0.8,
        },
        "begin"
      );
      tl.progress(1).progress(0);
    },
    {
      scope: state.wrapperContainer || undefined,
      dependencies: [state.wrapperContainer],
    }
  );

  function setLevelsAppear(scrolledPosition: number) {
    if (!state.wrapperContainer || !state.scrollContainer) return;
    const fields = state.wrapperContainer.querySelectorAll<HTMLElement>(
      ".levelTrophiesField"
    );
    function appearLevel(field: HTMLElement) {
      gsap.to(field, {
        opacity: 1,
        scale: 1,
        ease: "back.out(1.2)",
        duration: 0.8,
        onComplete: () => {
          const trophies = field.getAttribute("x-data-trophies");
          if (trophies === null) return;
          addAppearedTrophiesField(parseInt(trophies));
        },
      });
    }
    fields.forEach((field) => {
      // set to final state if already scrolled
      gsap.set(field, { opacity: 0, scale: 0 });
      if (scrolledPosition <= field.offsetTop + field.offsetHeight / 2) {
        appearLevel(field);
        return;
      }
      gsap.to(field, {
        scrollTrigger: {
          trigger: field,
          scroller: state.scrollContainer,
          toggleActions: "play none none none",
          start: `center+=${field.offsetHeight / 2} top`,
          end: "bottom top",
          onEnterBack: () => {
            appearLevel(field);
          },
        },
        duration: 1.5,
      });
    });
  }

  if (!state.scrollContainer) return null;

  return (
    <div className="absolute w-[32px] h-full left-0 z-10" ref={barRef}>
      <div className="absolute w-full h-full bg-gradient-to-r  from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] opacity-60" />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[60%] rounded-sm bg-gradient-to-r from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] brightness-200 innerMaxBar"
        style={{
          height: inPx(state.maxTrophiesBarHeight),
          transformOrigin: "bottom",
          bottom: `calc(100% - ${startTrophiesY2 + bottomGap}px)`,
        }}
      ></div>
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[60%] rounded-sm bg-gradient-to-r from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] brightness-125 innerBar"
        style={{
          height: inPx(state.trophiesBarHeight),
          transformOrigin: "bottom",
          bottom: `calc(100% - ${startTrophiesY2 + 7}px)`,
        }}
      ></div>
      <div
        className="absolute left-4 translate-y-1/2 z-20"
        style={{
          bottom: `calc(100% - ${startTrophiesY2 - state.trophiesBarHeight + bottomGap}px`,
        }}
      >
        <svg
          width="120"
          height="50"
          viewBox="0 0 120 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="svgmask">
            <rect
              x="7"
              y="0"
              width={113}
              height={50}
              fill="white"
              rx="4"
              ry="4"
            ></rect>
            <polygon points="0,25 7,35 7,15" fill="white" />
          </mask>
          <rect
            x="0"
            y="0"
            width={120}
            height={50}
            fill="#ffffff"
            mask="url(#svgmask)"
          ></rect>
          <image
            className="blur-[6px]"
            href={textureByRarity("legendary")}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#svgmask)"
          />
        </svg>
        <div className="w-full h-full absolute top-1/2 -translate-x-3 -translate-y-1/2 flex justify-center items-center">
          <img
            src={getImageUrl(ICONS, "trophy.png")}
            className="w-[28px] drop-shadow-[2px_1px_1px_black]"
          />
          <p className="text-slate-100 drop-shadow-[1px_1px_1px_black]">
            {numberOfTrophies}
          </p>
        </div>
      </div>
      {state.trophiesFields.map((field, i) => (
        <div
          className="absolute left-0 z-10 w-full"
          style={{ top: inPx(field) }}
          key={field}
        >
          <div className="w-full h-[2px] bg-gradient-to-b from-[rgb(88,88,89)] via-[rgb(177,177,178)] via-[37%] to-[rgb(88,88,80)] opacity-60" />
          <div className="absolute top-0 -translate-y-1/2 -right-2 translate-x-full text-slate-100 text-sm drop-shadow-[1px_1px_1px_black]">
            {(state.trophiesFields.length - i - 1) * 100}
          </div>
        </div>
      ))}
      {isTimelineOver && barRef.current && (
        <ScrollBack
          barRef={barRef.current}
          scrollContainer={state.scrollContainer}
          scrollDefaultPosition={state.scrollDefaultPosition}
          contextSafe={contextSafe}
        />
      )}
    </div>
  );
}

function ScrollBack({
  barRef,
  scrollContainer,
  contextSafe,
  scrollDefaultPosition,
}: {
  barRef: HTMLDivElement;
  scrollContainer: HTMLDivElement;
  contextSafe: ContextSafeFunc;
  scrollDefaultPosition: number;
}) {
  const [distanceFromTrophies, setDistanceFromTrophies] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollDistancePosition();
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function setScrollDistancePosition() {
    const allowedDistance =
      scrollContainer.getBoundingClientRect().height / 2 - 50;
    const distance = scrollContainer.scrollTop - scrollDefaultPosition;

    if (Math.abs(distance) > allowedDistance) {
      setDistanceFromTrophies(Math.sign(distance));
    } else {
      setDistanceFromTrophies(0);
    }
  }

  const scrollToCurrentTrophies = contextSafe(() => {
    gsap.to(scrollContainer, {
      scrollTo: { y: scrollDefaultPosition },
      duration: 0.6,
      ease: "power2.inOut",
    });
  });

  if (distanceFromTrophies === 0) {
    return null;
  }
  return (
    <div
      className="fixed top-[64px] z-10"
      style={{
        left: inPx((barRef.getBoundingClientRect().x ?? 0) + 40),
      }}
    >
      <button
        className="rounded-sm bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] p-0.5"
        onClick={scrollToCurrentTrophies}
      >
        {distanceFromTrophies > 0 ? (
          <ChevronUp color="white" />
        ) : (
          <ChevronDown color="white" />
        )}
      </button>
    </div>
  );
}
