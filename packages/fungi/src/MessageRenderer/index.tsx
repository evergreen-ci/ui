import styled from "@emotion/styled";
import { Message, MessageSourceType } from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import { MessageEvaluation, MessageEvalProps } from "../MessageEvaluation";
import { ToolRenderer } from "./ToolRenderer";
import { FungiUIMessage } from "./types";

export const MessageRenderer: React.FC<FungiUIMessage & MessageEvalProps> = ({
  id,
  onRatingChange,
  parts,
  role,
}) => (
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
              <MessageEvaluation onRatingChange={onRatingChange} />
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

export type { FungiUIMessage };
