import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { Message, MessageSourceType } from "@lg-chat/message";
import { UIMessagePart, UIDataTypes, UITools, ToolUIPart } from "ai";

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
    {parts.map((part, index) => (
      <RenderChatPart
        key={id + part.type + index}
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

const isToolUse = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ToolUIPart => part.type.startsWith("tool-");

type RenderToolUseProps = {
  tool: ToolUIPart;
};

const toolNameToLabel = (name: string) => {
  switch (name) {
    case "tool-askEvergreenAgentTool":
      return "Asking Evergreen Agent for more information...";
    case "tool-logCoreAnalyzerWorkflow":
      return "Analyzing Logs...";
    case "tool-askQuestionClassifierAgentTool":
      return "Refining and Classifying Question...";
    default:
      return name;
  }
  return name;
};

const StyledMessage = styled(Message)`
  > div {
    max-width: 100%;
  }
`;

const RenderToolUse: React.FC<RenderToolUseProps> = ({ tool }) => {
  console.log(tool);
  return (
    <div>
      <Chip label={toolNameToLabel(tool.type)} variant={ChipVariant.Blue} />
    </div>
  );
};

export default RenderChatParts;
