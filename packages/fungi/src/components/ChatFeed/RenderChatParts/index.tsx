import styled from "@emotion/styled";
import { Message, MessageSourceType } from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";
import RenderToolUse from "./RenderToolUse";

type RenderChatPartsProps = {
  parts: UIMessagePart<UIDataTypes, UITools>[];
  id: string;
  role: "user" | "assistant" | "system";
};

const RenderChatParts: React.FC<RenderChatPartsProps> = ({
  id,
  parts,
  role,
}) => (
  <>
    {parts.map((part) => (
      <RenderChatPart
        key={`${id}-${part.type}`}
        isSender={role === "user"}
        messageId={id}
        part={part}
      />
    ))}
  </>
);

type RenderChatPartProps = {
  isSender: boolean;
  messageId: string;
  part: UIMessagePart<UIDataTypes, UITools>;
};

const RenderChatPart: React.FC<RenderChatPartProps> = ({ isSender, part }) => {
  if (isToolUse(part)) {
    return <RenderToolUse tool={part} />;
  }

  switch (part.type) {
    case "text":
      return (
        <StyledMessage
          isSender={isSender}
          messageBody={part.text}
          sourceType={MessageSourceType.Markdown}
        />
      );
    default:
      return null;
  }
};

/**
 * Checks if the part is a tool use
 * @param part The part to check
 * @returns True if the part is a tool use, false otherwise
 */
const isToolUse = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ToolUIPart => part.type.startsWith("tool-");

const StyledMessage = styled(Message)`
  > div {
    max-width: 100%;
  }
`;

export default RenderChatParts;
