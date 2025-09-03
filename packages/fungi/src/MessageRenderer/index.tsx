import { UIMessage } from "@ai-sdk/react";
import styled from "@emotion/styled";
import { Message, MessageSourceType } from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import { ToolRenderer } from "./ToolRenderer";

export const MessageRenderer: React.FC<UIMessage> = ({ id, parts, role }) => (
  <>
    {parts.map((part, index) => {
      const key = `${id}-${part.type}-${index}`;
      if (part.type === "text") {
        return (
          <StyledMessage
            key={key}
            isSender={role === "user"}
            messageBody={part.text}
            sourceType={MessageSourceType.Markdown}
          />
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
