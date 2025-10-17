import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { size, transitionDuration } from "../../constants/tokens";

const { gray } = palette;

export enum AccordionCaretAlign {
  Start = "start",
  Center = "center",
  End = "end",
}

export enum AccordionCaretIcon {
  Caret = "Caret",
  Chevron = "Chevron",
}

interface AccordionProps {
  caretAlign?: AccordionCaretAlign;
  caretIcon?: AccordionCaretIcon;
  children: React.ReactNode;
  className?: string;
  "data-cy"?: string;
  defaultOpen?: boolean;
  disableAnimations?: boolean;
  onToggle?: (s: { isVisible: boolean }) => void;
  open?: boolean;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
  titleTag?: React.FC;
  toggledTitle?: React.ReactNode;
  useIndent?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  caretAlign = AccordionCaretAlign.Center,
  caretIcon = AccordionCaretIcon.Chevron,
  children,
  className,
  "data-cy": dataCy,
  defaultOpen = false,
  disableAnimations = true,
  onToggle = () => {},
  open,
  subtitle,
  title,
  titleTag,
  toggledTitle,
  useIndent = true,
}) => {
  const isControlled = open !== undefined;

  const [uncontrolledAccordionOpen, setUncontrolledAccordionOpen] =
    useState(defaultOpen);

  // When controlled, use the open prop. Otherwise, use the uncontrolled state.
  const accordionOpen = isControlled ? open : uncontrolledAccordionOpen;
  const setAccordionOpen = isControlled
    ? () => {}
    : setUncontrolledAccordionOpen;

  const TitleTag = titleTag ?? "span";
  const titleToShow = toggledTitle && accordionOpen ? toggledTitle : title;
  const titleComp = <TitleTag>{titleToShow}</TitleTag>;

  const toggleAccordionHandler = () => {
    onToggle({ isVisible: !accordionOpen });
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div className={className} data-cy={dataCy}>
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={toggleAccordionHandler}
        role="button"
      >
        <AccordionIcon
          aria-label="Accordion icon"
          open={accordionOpen}
          style={{ alignSelf: caretAlign }}
        >
          <Icon fill={gray.dark1} glyph={`${caretIcon}Right`} />
        </AccordionIcon>
        {titleComp}
      </AccordionToggle>
      {subtitle && <SubtitleContainer>{subtitle}</SubtitleContainer>}
      <AnimatedAccordion
        aria-expanded={accordionOpen}
        data-cy="accordion-collapse-container"
        disableAnimations={disableAnimations}
        hide={!accordionOpen}
      >
        <ContentsContainer useIndent={useIndent}>{children}</ContentsContainer>
      </AnimatedAccordion>
    </div>
  );
};

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  :hover {
    cursor: pointer;
  }
`;

const AccordionIcon = styled(IconButton)<{ open: boolean }>`
  flex-shrink: 0;
  transform: ${({ open }) => (open ? "rotate(90deg)" : "unset")};
  transition-property: transform;
  transition-duration: ${transitionDuration.default}ms;
`;

const AnimatedAccordion = styled.div<{
  hide: boolean;
  disableAnimations: boolean;
}>`
  display: grid;
  grid-template-rows: ${({ hide }): string => (hide ? "0fr" : "1fr")};
  ${({ disableAnimations }) =>
    !disableAnimations &&
    `transition: grid-template-rows ${transitionDuration.default}ms ease;`}
`;

const ContentsContainer = styled.div<{ useIndent: boolean }>`
  overflow: hidden;
  ${({ useIndent }) =>
    useIndent &&
    `
      margin-left: 26px;

      /* Handle input focus borders which get cut off due to overflow: hidden */
      padding: 0 ${size.xxs};
    `}
`;

const SubtitleContainer = styled.div`
  margin-left: 30px;
`;

export default Accordion;
