import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@via-ds/components";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { cx } from "@evg-ui/lib/utils/css";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import styles from "./index.module.css";

const { blue } = palette;

const DEFAULT_MAX_CHAR = 250;

interface CommitDescriptionProps {
  author: string;
  className?: string;
  inline?: boolean;
  lineClamp?: 2 | 3;
  maxLength?: number;
  message: string;
  onJiraLinkClick?: () => void;
  onToggle?: (expanded: boolean) => void;
  title?: string;
}

export const CommitDescription: React.FC<CommitDescriptionProps> = ({
  author,
  className,
  inline = false,
  lineClamp,
  maxLength = DEFAULT_MAX_CHAR,
  message,
  onJiraLinkClick,
  onToggle,
  title,
}) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const shouldTruncate = message.length > maxLength;
  const [showDescription, setShowDescription] = useState(!shouldTruncate);

  const displayMessage = showDescription
    ? message
    : message.substring(0, maxLength).concat("…");

  const linkedMessage = useMemo(
    () => jiraLinkify(displayMessage, jiraHost, onJiraLinkClick),
    [displayMessage, jiraHost, onJiraLinkClick],
  );

  const toggleText = showDescription ? "Show less" : "Show more";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const toggleTo = !showDescription;
    setShowDescription(toggleTo);
    onToggle?.(toggleTo);
  };

  const Wrapper = inline ? Body : BottomLabel;

  return (
    <Wrapper
      className={cx(className, lineClamp && styles.clamped)}
      data-line-clamp={lineClamp}
      title={title}
    >
      <AuthorLabel>{author} &middot; </AuthorLabel>
      <WordBreak>
        {linkedMessage}
        {shouldTruncate ? (
          <ToggleButton onClick={handleToggle}>{toggleText}</ToggleButton>
        ) : null}
      </WordBreak>
    </Wrapper>
  );
};

const BottomLabel = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
`;

const AuthorLabel = styled.b`
  flex-shrink: 0;
`;

const ToggleButton = styled.button`
  all: unset;

  cursor: pointer;
  color: ${blue.dark1};
  text-decoration: underline;
  margin-left: ${size.xxs};

  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.2px;
`;
