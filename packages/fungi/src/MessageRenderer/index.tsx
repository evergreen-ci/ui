import { UIMessage } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { Message, MessageSourceType } from "@lg-chat/message";
import { MessageActionsProps } from "@lg-chat/message-actions";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import { MessageEvaluation } from "../MessageEvaluation";
import { ToolRenderer } from "./ToolRenderer";

export const MessageRenderer: React.FC<
  UIMessage & { handleVote?: MessageActionsProps["onRatingChange"] }
> = ({ handleVote, id, parts, role }) => (
  <>
    {parts.map((part, index) => {
      const key = `${id}-${part.type}-${index}`;
      if (part.type === "text") {
        const isSender = role === "user";
        return (
          <StyledMessage
            key={key}
            data-cy={`message-${role}`}
            isSender={isSender}
            messageBody={part.text}
            sourceType={MessageSourceType.Markdown}
          >
            {!isSender && part.state === "done" && (
              <MessageEvaluation handleVote={handleVote} />
            )}
          </StyledMessage>
        );
      } else if (isToolUse(part)) {
        return <ToolRenderer key={key} {...part} />;
      }
      return null;
    })}
  </>
);

const StyledMessage = styled(Message)`
  > div {
    max-width: 100%;
  }
`;

const isToolUse = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ToolUIPart => part.type.startsWith("tool-");
