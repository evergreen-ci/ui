import { useState } from "react";
import styled from "@emotion/styled";
import { Message, ActionCardState } from "@lg-chat/message";
import { RichLink } from "@lg-chat/rich-links";
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
    tool.state === ToolStateEnum.OutputAvailable
      ? (tool as { output?: unknown }).output
      : undefined;

  const renderedOutput =
    output !== undefined && toolLabel.renderOutput
      ? toolLabel.renderOutput(output, onLinkClick)
      : undefined;

  const renderedLinks =
    output !== undefined && toolLabel.renderLinks
      ? toolLabel.renderLinks(output, onLinkClick)
      : undefined;

  const isStringOutput = typeof renderedOutput === "string";

  return (
    <>
      <StyledActionCard
        data-cy="tool-use-chip"
        description={description}
        onToggleExpanded={setIsExpanded}
        showExpandButton={!!renderedOutput}
        state={toolStateToActionCardState(tool.state)}
        title={toolStateToLabelCopy(tool.state, toolLabel)}
      >
        {isStringOutput && (
          <Message.ActionCard.ExpandableContent>
            {renderedOutput as string}
          </Message.ActionCard.ExpandableContent>
        )}
        {!isStringOutput && renderedOutput && isExpanded && (
          <RichOutput data-cy="tool-output">{renderedOutput}</RichOutput>
        )}
      </StyledActionCard>
      {renderedLinks && renderedLinks.length > 0 && (
        <LinksContainer>
          {renderedLinks.map((linkProps) => (
            <RichLink key={linkProps.children} {...linkProps} />
          ))}
        </LinksContainer>
      )}
    </>
  );
};

const RichOutput = styled.div``;

const StyledActionCard = styled(Message.ActionCard)`
  flex-shrink: 0;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
`;
