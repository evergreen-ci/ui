import { useState } from "react";
import styled from "@emotion/styled";
import { spacing } from "@leafygreen-ui/tokens";
import { Message, ActionCardState } from "@lg-chat/message";
import { ToolUIPart } from "ai";
import { AnimatedEllipsis } from "#AnimatedEllipsis";
import { ToolState, ToolStateEnum } from "../types";
import { renderableToolLabels } from "./constants";
import { ProgressIndicator } from "./ProgressIndicator";
import { ProgressUpdate } from "./utils";

const loadingStates: ToolState[] = [
  ToolStateEnum.InputStreaming,
  ToolStateEnum.InputAvailable,
];

const toolStateToActionCardState = (state: ToolState) => {
  if (state === ToolStateEnum.OutputError) return ActionCardState.Error;
  if (state === ToolStateEnum.OutputAvailable) return ActionCardState.Success;
  return ActionCardState.Running;
};

const toolStateToLabelCopy = (
  state: ToolState,
  toolLabel: (typeof renderableToolLabels)[keyof typeof renderableToolLabels],
): string => {
  if (state === ToolStateEnum.OutputError) return toolLabel.errorCopy;
  if (state === ToolStateEnum.OutputAvailable) return toolLabel.completedCopy;
  return toolLabel.loadingCopy;
};

type ToolRendererProps = ToolUIPart & {
  onLinkClick?: (href: string) => void;
  progress?: ProgressUpdate;
};

export const ToolRenderer: React.FC<ToolRendererProps> = ({
  onLinkClick,
  progress,
  ...tool
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toolLabel = renderableToolLabels[tool.type];
  if (!toolLabel) return null;

  const isLoading = loadingStates.includes(tool.state);

  let description: React.ReactNode;
  if (isLoading) {
    description = progress ? (
      <ProgressIndicator
        percentage={progress.percentage}
        phase={progress.phase}
      />
    ) : (
      <AnimatedEllipsis />
    );
  }

  const output =
    tool.state === ToolStateEnum.OutputAvailable ? tool.output : undefined;

  const renderedOutput =
    output !== undefined && toolLabel.renderOutput
      ? toolLabel.renderOutput(output, onLinkClick)
      : undefined;

  return (
    <StyledActionCard
      data-cy="tool-use-chip"
      description={description}
      onToggleExpanded={setIsExpanded}
      showExpandButton={!!renderedOutput}
      state={toolStateToActionCardState(tool.state)}
      title={toolStateToLabelCopy(tool.state, toolLabel)}
    >
      {/* ExpandableContent renders markdown and only accepts string children,
          so ReactNode output is rendered manually and gated by isExpanded. */}
      {typeof renderedOutput === "string" ? (
        <Message.ActionCard.ExpandableContent>
          {renderedOutput}
        </Message.ActionCard.ExpandableContent>
      ) : (
        renderedOutput &&
        isExpanded && (
          <RichOutput data-cy="tool-output">{renderedOutput}</RichOutput>
        )
      )}
    </StyledActionCard>
  );
};

const StyledActionCard = styled(Message.ActionCard)`
  flex-shrink: 0;
`;

const RichOutput = styled.div`
  padding: ${spacing[200]}px ${spacing[300]}px ${spacing[300]}px;
`;
