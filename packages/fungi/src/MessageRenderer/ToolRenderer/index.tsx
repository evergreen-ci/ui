import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { ToolUIPart } from "ai";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { AnimatedEllipsis } from "../../AnimatedEllipsis";
import { ToolState, ToolStateEnum } from "../types";
import { renderableToolLabels } from "./constants";

const loadingStates: ToolState[] = [
  ToolStateEnum.InputStreaming,
  ToolStateEnum.InputAvailable,
];
const toolStateToLabelState = (state: ToolState) => {
  if (state === ToolStateEnum.OutputError) return "errorCopy";
  if (state === ToolStateEnum.OutputAvailable) return "completedCopy";
  return "loadingCopy";
};
export const ToolRenderer: React.FC<ToolUIPart> = (tool) => {
  const toolLabel = renderableToolLabels[tool.type];
  if (!toolLabel) return null;
  const variant =
    tool.state === ToolStateEnum.OutputError ? Variant.Danger : Variant.Info;
  const isLoading = loadingStates.includes(tool.state);

  return (
    <StyledBanner
      data-cy="tool-use-chip"
      image={<StyledIcon fill="currentColor" glyph={toolLabel.glyph} />}
      variant={variant}
    >
      {toolLabel[toolStateToLabelState(tool.state)]}
      {isLoading && <AnimatedEllipsis />}
    </StyledBanner>
  );
};

const StyledBanner = styled(Banner)`
  padding: ${size.xs} ${size.s};
  width: fit-content;
`;

const StyledIcon = styled(Icon)`
  width: 14px;
  height: 14px;
`;
