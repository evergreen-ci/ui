import { useEffect } from "react";

const findClosestRef = ({
  refs,
  scrollTop,
}: {
  refs: React.RefObject<HTMLDivElement>[];
  scrollTop: number;
}) => {
  let minDistance = Number.MAX_VALUE;
  let minDistanceIdx = 0;

  refs.forEach((ref, idx) => {
    const currDistance = Math.abs(scrollTop - ref.current!.offsetTop);
    if (currDistance < minDistance) {
      minDistance = currDistance;
      minDistanceIdx = idx;
    }
  });

  return minDistanceIdx;
};

export const useFindClosestRef = ({
  refs,
  scrollContainerId,
  setActiveIndex,
}: {
  refs: React.RefObject<HTMLDivElement>[];
  scrollContainerId: string;
  setActiveIndex: (idx: number) => void;
}) => {
  useEffect(() => {
    const scrollElement = document.getElementById(
      scrollContainerId,
    ) as HTMLElement;

    const handleScroll = () => {
      const index = findClosestRef({
        scrollTop: scrollElement.scrollTop,
        refs,
      });
      setActiveIndex(index);
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
