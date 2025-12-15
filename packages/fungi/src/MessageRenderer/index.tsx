import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Message,
  MessageSourceType,
  MessageActionsProps,
} from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import { size } from "@evg-ui/lib/constants/tokens";
import { ToolRenderer } from "./ToolRenderer";
import { FungiUIMessage } from "./types";

export const MessageRenderer: React.FC<
  FungiUIMessage & MessageActionsProps
> = ({
  id,
  metadata,
  onClickCopy,
  onRatingChange,
  onSubmitFeedback,
  parts,
  role,
}) => (
  <>
    {parts.map((part, index) => {
      const key = `${id}-${part.type}-${index}`;
      if (part.type === "text") {
        const isLastPart = parts.length - 1 === index;
        const isSender = role === "user";

        const displayText =
          isSender && metadata?.originalMessage
            ? metadata.originalMessage
            : part.text;
        const chips = metadata?.chips ?? [];

        return (
          <MessageContent key={key}>
            <StyledMessage
              data-cy={`message-${role}`}
              isSender={isSender}
              messageBody={displayText}
              sourceType={MessageSourceType.Markdown}
            >
              {isSender && chips.length > 0 && (
                <Message.Links
                  css={badgeStyle}
                  headingText="Additional context"
                  links={chips}
                />
              )}
              {!isSender && part.state === "done" && isLastPart && (
                <Message.Actions
                  onClickCopy={onClickCopy}
                  onRatingChange={onRatingChange}
                  onSubmitFeedback={onSubmitFeedback}
                />
              )}
            </StyledMessage>
          </MessageContent>
        );
      } else if (isToolUse(part)) {
        return <ToolRenderer key={key} {...part} />;
      }
      return null;
    })}
  </>
);

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
`;

const StyledMessage = styled(Message)`
  > div {
    max-width: 100%;
  }
`;

const isToolUse = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ToolUIPart => part.type.startsWith("tool-");

const badgeStyle = css`
  > div > div > div > div {
    flex-shrink: 0;
  }
`;

export type { FungiUIMessage };
