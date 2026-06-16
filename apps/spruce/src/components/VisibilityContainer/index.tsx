import { useCallback, useMemo, useRef, useState } from "react";
import useIntersectionObserver from "hooks/useIntersectionObserver";

interface VisibilityContainerProps {
  children: React.ReactNode;
  className?: string;
  "data-cy"?: string;
  offset?: number;
  style?: React.CSSProperties;
}
/**
 * `VisibilityContainer` is a component that will only render its children when it is visible in the viewport.
 * Styling is accepted via className/style rather than Emotion's css prop so that pages rendering many
 * instances (e.g. the waterfall) avoid the css prop's per-element runtime.
 * @param props - VisibilityContainerProps
 * @param props.children - The children to render when the component is visible
 * @param props.className - Class name to apply to the outer div element
 * @param props."data-cy" - Optional data-cy property
 * @param props.offset - An offset in px which defines when to make component visible
 * @param props.style - Inline styles to apply to the outer div element
 * @returns The VisibilityContainer component
 */
const VisibilityContainer: React.FC<VisibilityContainerProps> = ({
  children,
  className,
  "data-cy": dataCy,
  offset = 0,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    ([entry]) => {
      setIsVisible(entry.isIntersecting);
    },
    [],
  );

  const observerOptions = useMemo(
    () => ({ rootMargin: `${offset}px 0px ${offset}px 0px` }),
    [offset],
  );

  useIntersectionObserver(containerRef, handleIntersect, observerOptions);

  return (
    <div
      ref={containerRef}
      className={className}
      data-cy={dataCy}
      data-visible={isVisible}
      style={style}
    >
      {isVisible ? children : null}
    </div>
  );
};

export default VisibilityContainer;
