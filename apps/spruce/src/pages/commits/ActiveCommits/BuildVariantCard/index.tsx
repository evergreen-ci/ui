import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { StyledRouterLink } from "components/styles";
import VisibilityContainer from "components/VisibilityContainer";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { VariantGroupedTaskStatusBadges } from "pages/commits/ActiveCommits/BuildVariantCard/VariantGroupedTaskStatusBadges";
import {
  injectGlobalDimStyle,
  removeGlobalDimStyle,
} from "pages/commits/ActiveCommits/utils";
import { TASK_ICON_PADDING } from "pages/commits/constants";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
  hasCedarResults: boolean;
}[];
interface Props {
  variant: string;
  height: number;
  buildVariantDisplayName: string;
  tasks?: taskList;
  versionId: string;
  projectIdentifier: string;
  groupedVariantStats?: {
    statusCounts: StatusCount[];
  };
  order: number;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  groupedVariantStats,
  height,
  order,
  projectIdentifier,
  tasks,
  variant,
  versionId,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  let render = null;
  render = (
    <>
      {groupedVariantStats && (
        <VariantGroupedTaskStatusBadges
          onClick={(statuses) => () => {
            sendEvent({
              name: "Clicked grouped task status badge",
              statuses,
            });
          }}
          statusCounts={groupedVariantStats.statusCounts}
          variant={variant}
          versionId={versionId}
        />
      )}
      {tasks && <RenderTaskIcons tasks={tasks} variant={variant} />}
    </>
  );
  return (
    <Container>
      <Label
        data-cy="variant-header"
        onClick={() => {
          sendEvent({
            name: "Clicked variant label",
          });
        }}
        to={getVariantHistoryRoute(projectIdentifier, variant, {
          selectedCommit: order,
        })}
      >
        {buildVariantDisplayName}
      </Label>
      <Content height={`${height}px`}>
        <VisibilityContainer>{render}</VisibilityContainer>
      </Content>
    </Container>
  );
};

interface RenderTaskIconsProps {
  tasks: taskList;
  variant: string;
}

const RenderTaskIcons: React.FC<RenderTaskIconsProps> = ({ tasks, variant }) =>
  tasks.length ? (
    <IconContainer
      data-cy="build-variant-icon-container"
      onMouseEnter={() => injectGlobalDimStyle()}
      onMouseLeave={() => removeGlobalDimStyle()}
    >
      {tasks.map(({ displayName, hasCedarResults, id, status, timeTaken }) => (
        <WaterfallTaskStatusIcon
          key={id}
          displayName={displayName}
          hasCedarResults={hasCedarResults}
          identifier={`${variant}-${displayName}`}
          status={status}
          taskId={id}
          timeTaken={timeTaken}
        />
      ))}
    </IconContainer>
  ) : null;

const Label = styled(StyledRouterLink)`
  word-break: normal;
  overflow-wrap: anywhere;
`;

const IconContainer = styled.div`
  display: flex;
  padding: ${TASK_ICON_PADDING}px 0;
  flex-wrap: wrap;
  width: fit-content;
`;

const Container = styled.div`
  width: 160px;
  margin-bottom: ${size.s};
`;

const Content = styled.div<{ height: string }>`
  height: ${({ height }) => height};
`;
