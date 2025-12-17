import styled from "@emotion/styled";
import {
  Message,
  MessageSourceType,
  MessageActionsProps,
} from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import { size } from "@evg-ui/lib/constants/tokens";
import { useChatContext } from "../Context";
import { ContextChips } from "../ContextChips";
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
}) => {
  const { getChipsForMessage } = useChatContext();

  return (
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
          const chips = getChipsForMessage(metadata?.messageId ?? "");

          return (
            <MessageContent key={key}>
              {isSender && chips.length > 0 && (
                <ContextChips chips={chips} dismissible={false} />
              )}
              <StyledMessage
                data-cy={`message-${role}`}
                isSender={isSender}
                messageBody={displayText}
                sourceType={MessageSourceType.Markdown}
              >
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
};

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

export type { FungiUIMessage };
