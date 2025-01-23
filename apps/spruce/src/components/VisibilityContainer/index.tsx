import { useRef, useState } from "react";
import { SerializedStyles } from "@emotion/react";
import useIntersectionObserver from "hooks/useIntersectionObserver";

interface VisibilityContainerProps {
  children: React.ReactNode;
  "data-cy"?: string;
  containerCss?: SerializedStyles;
  offset?: number;
}
/**
 * `VisibilityContainer` is a component that will only render its children when it is visible in the viewport.
 * @param props - VisibilityContainerProps
 * @param props.children - The children to render when the component is visible
 * @param props.containerCss - Styles to apply to the outer div element
 * @param props."data-cy" - Optional data-cy property
 * @param props.offset - An offset in px which defines when to make component visible
 * @returns The VisibilityContainer component
 */
const VisibilityContainer: React.FC<VisibilityContainerProps> = ({
  children,
  containerCss,
  "data-cy": dataCy,
  offset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useIntersectionObserver(
    containerRef,
    ([entry]) => {
      setIsVisible(entry.isIntersecting);
    },
    { rootMargin: `${offset}px 0px ${offset}px 0px` },
  );

  return (
    <div
      ref={containerRef}
      css={containerCss}
      data-cy={dataCy}
      data-visible={isVisible}
    >
      {isVisible ? children : null}
    </div>
  );
};

export default VisibilityContainer;
