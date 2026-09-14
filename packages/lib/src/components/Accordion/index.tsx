import { useState } from "react";
import { IconButton } from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { cx } from "../../utils/css";
import { Icon } from "../Icon";
import styles from "./index.module.css";

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
  "data-testid"?: string;
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
  "data-testid": dataTestId,
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
    <div className={className} data-testid={dataTestId}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */}
      <div
        className={styles.toggle}
        data-testid="accordion-toggle"
        onClick={toggleAccordionHandler}
        role="button"
      >
        <IconButton
          aria-label="Accordion icon"
          className={cx(styles.icon, accordionOpen && styles.iconOpen)}
          style={{ alignSelf: caretAlign }}
        >
          <Icon fill={gray.dark1} glyph={`${caretIcon}Right`} />
        </IconButton>
        {titleComp}
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      <div
        aria-expanded={accordionOpen}
        className={cx(
          styles.collapseContainer,
          !accordionOpen && styles.collapseContainerHidden,
          !disableAnimations && styles.collapseContainerAnimated,
        )}
        data-testid="accordion-collapse-container"
      >
        <div
          className={cx(styles.contents, useIndent && styles.contentsIndented)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
