import { useReducer } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { Accordion } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { shortenGithash } from "@evg-ui/lib/utils";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { getVersionRoute } from "constants/routes";
import {
  Parameter,
  SortDirection,
  SortOrder,
  TaskSortCategory,
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { ParametersModal } from "pages/version/ParametersModal";
import { PatchStatus } from "types/patch";
import DownstreamTasksTable from "./DownstreamTasksTable";
import { reducer } from "./state";

const defaultSorts: SortOrder[] = [
  {
    Key: TaskSortCategory.Status,
    Direction: SortDirection.Asc,
  },
  {
    Key: TaskSortCategory.BaseStatus,
    Direction: SortDirection.Desc,
  },
];

interface DownstreamProjectAccordionProps {
  baseVersionID: string;
  githash: string;
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
  parameters: Parameter[];
}

export const DownstreamProjectAccordion: React.FC<
  DownstreamProjectAccordionProps
> = ({
  baseVersionID,
  childPatchId,
  githash,
  parameters,
  projectName,
  status,
  taskCount,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    baseStatuses: [],
    limit: 10,
    page: 0,
    statuses: [],
    taskName: "",
    variant: "",
    sorts: defaultSorts,
  });

  const { baseStatuses, limit, page, sorts, statuses, taskName, variant } =
    state;

  const { data, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(VERSION_TASKS, {
    variables: {
      versionId: childPatchId,
      taskFilterOptions: {
        baseStatuses,
        limit,
        page,
        sorts,
        statuses,
        taskName,
        variant,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  usePolling<VersionTasksQuery, VersionTasksQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  const showSkeleton = !data;
  const { version } = data || {};
  const { isPatch, tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};

  return (
    <Wrapper data-cy="project-accordion">
      <Accordion
        defaultOpen={status === PatchStatus.Failed}
        subtitle={
          <DownstreamMetadata
            baseVersionID={baseVersionID}
            githash={githash}
            parameters={parameters}
          />
        }
        title={
          <>
            <ProjectTitleWrapper>
              <span data-cy="project-title">{projectName}</span>
            </ProjectTitleWrapper>
            <PatchStatusBadge status={status} />
          </>
        }
        titleTag={FlexContainer}
      >
        <AccordionContents>
          <DownstreamTasksTable
            childPatchId={childPatchId}
            count={count}
            dispatch={dispatch}
            isPatch={isPatch}
            limit={limit}
            loading={showSkeleton}
            page={page}
            taskCount={taskCount}
            tasks={tasksData}
          />
        </AccordionContents>
      </Accordion>
    </Wrapper>
  );
};

interface DownstreamMetadataProps {
  baseVersionID: string;
  githash: string;
  parameters: Parameter[];
}
const DownstreamMetadata: React.FC<DownstreamMetadataProps> = ({
  baseVersionID,
  githash,
  parameters,
}) => (
  <FlexRow>
    <PaddedText>
      Base commit:{" "}
      <InlineCode
        as={Link}
        data-cy="downstream-base-commit"
        to={getVersionRoute(baseVersionID)}
      >
        {shortenGithash(githash)}
      </InlineCode>
    </PaddedText>
    <ParametersModal parameters={parameters} />
  </FlexRow>
);

const PaddedText = styled.span`
  padding: ${size.xxs} 0;
`;
const ProjectTitleWrapper = styled.div`
  margin-right: ${size.xs};
  font-weight: bold;
`;

const AccordionContents = styled.div`
  margin: ${size.s} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;
