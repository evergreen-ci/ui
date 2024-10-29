import { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { size } from "constants/tokens";

interface AccordionProps {
  /** Where the caret icon should be aligned */
  caretAlignSelf?: "start" | "center" | "end";
  children: React.ReactNode;
  className?: string;
  "data-cy"?: string;
  defaultOpen?: boolean;
  disableAnimation?: boolean;
  onToggle?: (s: { isVisible: boolean }) => void;
  showCaret?: boolean;
  title: React.ReactNode;
  titleTag?: React.FC;
  /** `toggledTitle` replaces the title element when the accordion is open */
  toggledTitle?: React.ReactNode;
  toggleFromBottom?: boolean;
  useIndent?: boolean;
  subtitle?: React.ReactNode;
  /** This prop prevents the accordion from rendering the child component if the accordion is collapsed. It is useful if the child is expensive to render. */
  shouldRenderChildIfHidden?: boolean;
}
export const Accordion: React.FC<AccordionProps> = ({
  caretAlignSelf = "center",
  children,
  className,
  "data-cy": dataCy,
  defaultOpen = false,
  disableAnimation = false,
  onToggle = () => {},
  shouldRenderChildIfHidden = true,
  showCaret = true,
  subtitle,
  title,
  titleTag,
  toggleFromBottom = false,
  toggledTitle,
  useIndent = true,
}) => {
  const [isAccordionDisplayed, setIsAccordionDisplayed] = useState(defaultOpen);
  const [shouldRenderContents, setShouldRenderContents] = useState(defaultOpen);

  const toggleAccordionHandler = useCallback((): void => {
    setIsAccordionDisplayed(!isAccordionDisplayed);
    onToggle({ isVisible: !isAccordionDisplayed });
  }, [isAccordionDisplayed, onToggle]);
  const showToggledTitle = isAccordionDisplayed ? toggledTitle : title;
  const TitleTag = titleTag ?? "span";
  const titleComp = (
    <TitleTag>{toggledTitle ? showToggledTitle : title}</TitleTag>
  );

  let contents = null;
  if (shouldRenderChildIfHidden || shouldRenderContents) {
    contents = children;
  }

  const handleTransitionEnd = () => {
    if (!isAccordionDisplayed) {
      setShouldRenderContents(false);
    }
  };

  useEffect(() => {
    if (isAccordionDisplayed) {
      setShouldRenderContents(true);
    }
  }, [isAccordionDisplayed]);

  const animatedAccordion = (
    <AnimatedAccordion
      aria-expanded={isAccordionDisplayed}
      data-cy="accordion-collapse-container"
      disableAnimation={disableAnimation}
      hide={!isAccordionDisplayed}
      onTransitionEnd={handleTransitionEnd}
    >
      <ContentsContainer indent={showCaret && useIndent}>
        {contents}
      </ContentsContainer>
    </AnimatedAccordion>
  );
  return (
    <div className={className} data-cy={dataCy}>
      {toggleFromBottom && animatedAccordion}
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={toggleAccordionHandler}
        role="button"
      >
        {showCaret && (
          <Icon
            glyph={isAccordionDisplayed ? "CaretDown" : "CaretRight"}
            style={{ alignSelf: caretAlignSelf }}
          />
        )}
        {titleComp}
      </AccordionToggle>
      {subtitle && (
        <SubtitleContainer showCaret={showCaret}>{subtitle}</SubtitleContainer>
      )}
      {!toggleFromBottom && animatedAccordion}
    </div>
  );
};

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

const AnimatedAccordion = styled.div<{
  hide: boolean;
  disableAnimation: boolean;
}>`
  /* This is used to calculate a fixed height for the Accordion since height
      transitions require a fixed height for their end height */
  max-height: ${({ hide }) => (hide ? "0px" : "9999px")};
  overflow-y: ${({ hide }) => hide && "hidden"};
  ${({ disableAnimation, hide }) =>
    !disableAnimation &&
    `transition: ${
      hide
        ? "max-height 0.3s cubic-bezier(0, 1, 0, 1)"
        : "max-height 0.6s ease-in-out"
    }`};
`;

const ContentsContainer = styled.div`
  margin-left: ${({ indent }: { indent: boolean }) => indent && size.s};
`;

const SubtitleContainer = styled.div<{ showCaret: boolean }>`
  ${({ showCaret }) => showCaret && `margin-left: ${size.s};`}
`;
