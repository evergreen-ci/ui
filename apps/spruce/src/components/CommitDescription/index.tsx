import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@via-ds/components";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";

const { blue } = palette;

const DEFAULT_MAX_CHAR = 250;

interface CommitDescriptionProps {
  author: string;
  inline?: boolean;
  maxLength?: number;
  message: string;
  onJiraLinkClick?: () => void;
  onToggle?: (expanded: boolean) => void;
}

export const CommitDescription: React.FC<CommitDescriptionProps> = ({
  author,
  inline = false,
  maxLength = DEFAULT_MAX_CHAR,
  message,
  onJiraLinkClick,
  onToggle,
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
    setShowDescription(!showDescription);
    onToggle?.(!showDescription);
  };

  const messageContent = (
    <WordBreak>
      {linkedMessage}
      {shouldTruncate ? (
        <ToggleButton onClick={handleToggle}>{toggleText}</ToggleButton>
      ) : null}
    </WordBreak>
  );

  if (inline) {
    return (
      <Body>
        <AuthorLabel>{author} •</AuthorLabel> {messageContent}
      </Body>
    );
  }

  return (
    <BottomLabel>
      <AuthorLabel>{author} •</AuthorLabel>
      {messageContent}
    </BottomLabel>
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
