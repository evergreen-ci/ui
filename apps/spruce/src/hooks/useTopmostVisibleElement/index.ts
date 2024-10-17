import { useEffect, useState } from "react";

const findTopmostVisibleElement = ({
  elements,
  scrollTop,
}: {
  elements: HTMLElement[];
  scrollTop: number;
}) => {
  let minDistance = Number.MAX_VALUE;
  let minDistanceId = "";

  elements.forEach((el) => {
    const currDistance = Math.abs(scrollTop - el.offsetTop);
    if (currDistance < minDistance) {
      minDistance = currDistance;
      minDistanceId = el.id;
    }
  });

  return minDistanceId;
};

/**
 * `useTopmostVisibleElement` is used to track the ID of the element that is visible on the screen and closest
 * to the top of the element with scrollContainerId.
 * @param obj - object representing arguments to `useTopmostVisibleElement` hook
 * @param obj.elements - list of elements from which to determine the topmost visible element
 * @param obj.scrollContainerId - the ID of the scroll container. Referencing the scroll container is necessary
 * because the hook listens on the "scroll" event.
 * @returns the ID of the topmost visible element (string)
 */
export const useTopmostVisibleElement = ({
  elements,
  scrollContainerId,
}: {
  elements: HTMLElement[];
  scrollContainerId: string;
}) => {
  const [topmostVisibleElementId, setTopmostVisibleElementId] = useState("");

  useEffect(() => {
    const scrollElement = document.getElementById(
      scrollContainerId,
    ) as HTMLElement;

    const handleScroll = () => {
      const id = findTopmostVisibleElement({
        scrollTop: scrollElement.scrollTop,
        elements,
      });
      setTopmostVisibleElementId(id);
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  return topmostVisibleElementId;
};
