import styled from "@emotion/styled";
import { Chip, Variant as ChipVariant } from "@leafygreen-ui/chip";
import { ToolUIPart } from "ai";
import Icon from "@evg-ui/lib/components/Icon";
import { toolLabels } from "../../../constants/toolMappings";

const AnimatedEllipsis = styled.span`
  display: inline-block;
  width: 1.5em;
  text-align: left;
  &::after {
    content: "";
    display: inline-block;
    width: 1.5em;
    animation: ellipsis steps(4, end) 1.2s infinite;
    overflow: hidden;
    vertical-align: bottom;
  }
  @keyframes ellipsis {
    0% {
      content: "";
    }
    25% {
      content: ".";
    }
    50% {
      content: "..";
    }
    75% {
      content: "...";
    }
    100% {
      content: "";
    }
  }
`;

const toolNameToLabel = (name: string, state: ToolUIPart["state"]) => {
  const label = toolLabels[name];
  if (!label) {
    return null;
  }

  if (state === "output-error") {
    return label.error;
  }
  if (state === "input-streaming") {
    return (
      <>
        {label.loading}
        <AnimatedEllipsis />
      </>
    );
  }
  return label.done;
};

type RenderToolUseProps = {
  tool: ToolUIPart;
};

const RenderToolUse: React.FC<RenderToolUseProps> = ({ tool }) => {
  const toolName = toolNameToLabel(tool.type, tool.state);
  if (!toolName) {
    return null;
  }
  return (
    <Chip
      data-cy="tool-use-chip"
      label={
        <>
          <Icon glyph="Wrench" />
          {toolName}
        </>
      }
      variant={ChipVariant.Blue}
    />
  );
};

export default RenderToolUse;
