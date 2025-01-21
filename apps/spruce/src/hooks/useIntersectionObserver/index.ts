import { useEffect, RefObject } from "react";

const useIntersectionObserver = (
  target: RefObject<HTMLElement>,
  onIntersect: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, options);
    const targetRef = target.current;
    if (targetRef) {
      observer.observe(targetRef);
    }
    return () => {
      observer.disconnect();
    };
  }, [target, onIntersect, options]);
};

export default useIntersectionObserver;
