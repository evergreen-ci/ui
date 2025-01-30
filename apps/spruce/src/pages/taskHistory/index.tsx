import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { ProjectBanner } from "components/Banners";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import {
  context,
  ColumnPaginationButtons,
  HistoryTableTestSearch,
  hooks,
  constants,
} from "components/HistoryTable";
import HistoryTable from "components/HistoryTable/HistoryTable";
import { useHistoryTable } from "components/HistoryTable/HistoryTableContext";
import { PageWrapper } from "components/styles";
import { slugs } from "constants/routes";
import {
  MainlineCommitsForHistoryQuery,
  MainlineCommitsForHistoryQueryVariables,
} from "gql/generated/types";
import { MAINLINE_COMMITS_FOR_HISTORY } from "gql/queries";
import { usePageTitle } from "hooks";
import { string } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import BuildVariantSelector from "./BuildVariantSelector";
import ColumnHeaders from "./ColumnHeaders";
import TaskHistoryRow from "./TaskHistoryRow";

const { HistoryTableProvider } = context;
const { applyStrictRegex } = string;
const { useJumpToCommit, useTestFilters } = hooks;

const TaskHistoryContents: React.FC = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const {
    [slugs.projectIdentifier]: projectIdentifier,
    [slugs.taskName]: taskName,
  } = useParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { ingestNewCommits } = useHistoryTable();
  usePageTitle(`Task History | ${projectIdentifier} | ${taskName}`);
  useTestFilters();
  useJumpToCommit();

  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    constants.queryParamsToDisplay,
  );
  const dispatchToast = useToastContext();

  const { data, loading, refetch } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(MAINLINE_COMMITS_FOR_HISTORY, {
    variables: {
      mainlineCommitsOptions: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        projectIdentifier,
        limit: 10,
        shouldCollapse: true,
      },
      buildVariantOptions: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        tasks: [applyStrictRegex(taskName)],
        includeBaseTasks: false,
      },
    },
    notifyOnNetworkStatusChange: true, // This is so that we can show the loading state
    fetchPolicy: "no-cache", // This is because we already cache the data in the history table
    onCompleted({ mainlineCommits }) {
      leaveBreadcrumb(
        "Loaded more commits for task history",
        {
          projectIdentifier,
          taskName,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          numCommits: mainlineCommits.versions.length,
        },
        SentryBreadcrumb.UI,
      );
      ingestNewCommits(mainlineCommits);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error loading the task history: ${err.message}`,
      );
    },
  });

  const handleLoadMore = () => {
    if (data) {
      leaveBreadcrumb(
        "Requesting more task history",
        {
          projectIdentifier,
          taskName,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
        },
        SentryBreadcrumb.UI,
      );
      refetch({
        mainlineCommitsOptions: {
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          projectIdentifier,
          limit: 10,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
          shouldCollapse: true,
        },
        buildVariantOptions: {
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          tasks: [applyStrictRegex(taskName)],
          includeBaseTasks: false,
        },
      });
    }
  };

  return (
    <PageWrapper>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <CenterPage>
        <PageHeader>
          <H2>Task Name: {taskName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch
              onSubmit={() => {
                sendEvent({
                  name: "Filtered failed tests",
                });
              }}
            />
            <BuildVariantSelector
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              projectIdentifier={projectIdentifier}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              taskName={taskName}
            />
          </PageHeaderContent>
        </PageHeader>
        <PaginationFilterWrapper>
          <BadgeWrapper>
            <FilterChips
              chips={chips}
              onClearAll={() => {
                sendEvent({ name: "Deleted all badges" });
                handleClearAll();
              }}
              onRemove={(b) => {
                sendEvent({ name: "Deleted a badge" });
                handleOnRemove(b);
              }}
            />
          </BadgeWrapper>
          <ColumnPaginationButtons
            onClickNext={() =>
              sendEvent({ name: "Changed page", direction: "next" })
            }
            onClickPrev={() =>
              sendEvent({ name: "Changed page", direction: "previous" })
            }
          />
        </PaginationFilterWrapper>
        <div>
          <ColumnHeaders
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            projectIdentifier={projectIdentifier}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            taskName={taskName}
          />
          <TableWrapper>
            <HistoryTable
              finalRowCopy="End of task history"
              loading={loading}
              loadMoreItems={handleLoadMore}
            >
              {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
              {TaskHistoryRow}
            </HistoryTable>
          </TableWrapper>
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

const TaskHistory = () => (
  <HistoryTableProvider>
    <TaskHistoryContents />
  </HistoryTableProvider>
);
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: ${size.s};
`;

const PageHeaderContent = styled.div`
  display: flex;
  align-items: flex-end;
  padding-top: 28px;
`;

const PaginationFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${size.s};
`;

const BadgeWrapper = styled.div`
  padding-bottom: ${size.s};
`;

const TableWrapper = styled.div`
  height: 80vh;
`;

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export default TaskHistory;
