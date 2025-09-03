import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { ToolUIPart } from "ai";
import Icon from "@evg-ui/lib/components/Icon";
import { AnimatedEllipsis } from "../AnimatedEllipsis";
import { toolLabels } from "./constants";

export const ToolRenderer: React.FC<ToolUIPart> = (tool) => {
  const toolName = toolNameToLabel(tool.type, tool.state);
  if (!toolName) {
    return null;
  }
  return (
    <StyledBanner data-cy="tool-use-chip" image={<StyledIcon glyph="Wrench" />}>
      {toolName}
    </StyledBanner>
  );
};

const StyledBanner = styled(Banner)`
  padding: 6px 12px;
  width: fit-content;
`;

const StyledIcon = styled(Icon)`
  width: 14px;
  height: 14px;
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
