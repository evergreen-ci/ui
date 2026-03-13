import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { ToolUIPart } from "ai";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { AnimatedEllipsis } from "#AnimatedEllipsis";
import { ToolState, ToolStateEnum } from "../types";
import { renderableToolLabels } from "./constants";
import { ProgressIndicator } from "./ProgressIndicator";
import { ProgressUpdate } from "./utils";

const loadingStates: ToolState[] = [
  ToolStateEnum.InputStreaming,
  ToolStateEnum.InputAvailable,
];

const toolStateToLabelState = (state: ToolState) => {
  if (state === ToolStateEnum.OutputError) return "errorCopy";
  if (state === ToolStateEnum.OutputAvailable) return "completedCopy";
  return "loadingCopy";
};

type ToolRendererProps = ToolUIPart & {
  progress?: ProgressUpdate;
};

export const ToolRenderer: React.FC<ToolRendererProps> = ({
  progress,
  ...tool
}) => {
  const toolLabel = renderableToolLabels[tool.type];
  if (!toolLabel) return null;

  const isLoading = loadingStates.includes(tool.state);
  const variant =
    tool.state === ToolStateEnum.OutputError ? Variant.Danger : Variant.Info;

  return (
    <StyledBanner
      data-cy="tool-use-chip"
      image={<StyledIcon fill="currentColor" glyph={toolLabel.glyph} />}
      variant={variant}
    >
      {toolLabel[toolStateToLabelState(tool.state)]}
      {isLoading && !progress && <AnimatedEllipsis />}
      {isLoading && progress && (
        <ProgressIndicator
          percentage={progress.percentage}
          phase={progress.phase}
        />
      )}
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
