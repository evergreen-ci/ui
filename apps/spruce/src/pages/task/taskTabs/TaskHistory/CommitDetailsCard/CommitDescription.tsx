import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { WordBreak } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskHistoryAnalytics } from "analytics";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";

const { blue } = palette;

interface CommitDetailsCardProps {
  author: string;
  message: string;
}

const CommitDescription: React.FC<CommitDetailsCardProps> = ({
  author,
  message,
}) => {
  const { sendEvent } = useTaskHistoryAnalytics();

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const shouldTruncate = message.length > MAX_CHAR;
  const truncatedText = message.substring(0, MAX_CHAR).concat("…");

  const [showDescription, setShowDescription] = useState(!shouldTruncate);

  return (
    <BottomLabel>
      <AuthorLabel>{author} - </AuthorLabel>
      <WordBreak>
        {jiraLinkify(showDescription ? message : truncatedText, jiraHost)}
        {shouldTruncate ? (
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation();
              setShowDescription(!showDescription);
              sendEvent({
                name: "Toggled commit description",
                expanded: showDescription,
              });
            }}
          >
            {showDescription ? "Show less" : "Show more"}
          </ToggleButton>
        ) : null}
      </WordBreak>
    </BottomLabel>
  );
};

export default CommitDescription;

const MAX_CHAR = 250;

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
