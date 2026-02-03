import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { WordBreak } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useTaskHistoryAnalytics } from "analytics";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";

const { blue } = palette;

const MAX_CHAR = 250;

interface CommitDescriptionProps {
  author: string;
  message: string;
}

const CommitDescription: React.FC<CommitDescriptionProps> = ({
  author,
  message,
}) => {
  const { sendEvent } = useTaskHistoryAnalytics();

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const shouldTruncate = message.length > MAX_CHAR;
  const [showDescription, setShowDescription] = useState(!shouldTruncate);

  const displayMessage = showDescription
    ? message
    : message.substring(0, MAX_CHAR).concat("…");

  const linkedMessage = useMemo(
    () => jiraLinkify(displayMessage, jiraHost),
    [displayMessage, jiraHost],
  );

  const toggleText = showDescription ? "Show less" : "Show more";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription((prev) => {
      sendEvent({
        name: "Toggled commit description",
        expanded: !prev,
      });
      return !prev;
    });
  };

  return (
    <BottomLabel>
      <AuthorLabel>{author} - </AuthorLabel>
      <WordBreak>
        {linkedMessage}
        {shouldTruncate ? (
          <ToggleButton onClick={handleToggle}>{toggleText}</ToggleButton>
        ) : null}
      </WordBreak>
    </BottomLabel>
  );
};

export default CommitDescription;

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
