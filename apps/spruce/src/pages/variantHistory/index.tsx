import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  leaveBreadcrumb,
  SentryBreadcrumbTypes,
} from "@evg-ui/lib/utils/errorReporting";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
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
import { string } from "utils";
import ColumnHeaders from "./ColumnHeaders";
import TaskSelector from "./TaskSelector";
import VariantHistoryRow from "./VariantHistoryRow";

const { HistoryTableProvider } = context;
const { useJumpToCommit, useTestFilters } = hooks;
const { applyStrictRegex } = string;

const VariantHistoryContents: React.FC = () => {
  const {
    [slugs.projectIdentifier]: projectIdentifier,
    [slugs.variantName]: variantName,
  } = useParams();
  const { sendEvent } = useProjectHistoryAnalytics({ page: "Variant history" });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { ingestNewCommits } = useHistoryTable();
  usePageTitle(`Variant History | ${projectIdentifier} | ${variantName}`);
  useJumpToCommit();
  useTestFilters();
  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    constants.queryParamsToDisplay,
  );
  const { data, error, loading, refetch } = useQuery<
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
        variants: [applyStrictRegex(variantName)],
        includeBaseTasks: false,
      },
    },
    notifyOnNetworkStatusChange: true, // This is so that we can show the loading state
    fetchPolicy: "no-cache", // This is because we already cache the data in the history table
  });

  const prevLoadingRef = useRef(loading);
  useEffect(() => {
    // Trigger only when loading transitions from true to false (query completed)
    if (prevLoadingRef.current && !loading && data?.mainlineCommits) {
      leaveBreadcrumb(
        "Loaded more commits for variant history",
        {
          projectIdentifier,
          variantName,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          numCommits: data.mainlineCommits.versions.length,
        },
        SentryBreadcrumbTypes.UI,
      );
      ingestNewCommits(data.mainlineCommits);
    }
    prevLoadingRef.current = loading;
  }, [loading, data, projectIdentifier, variantName, ingestNewCommits]);

  useErrorToast(error, "There was an error loading the variant history");

  const handleLoadMore = () => {
    if (data) {
      leaveBreadcrumb(
        "Requesting more variant history",
        {
          projectIdentifier,
          variantName,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
        },
        SentryBreadcrumbTypes.UI,
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
          variants: [applyStrictRegex(variantName)],
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
          <H2>Build Variant: {variantName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch
              onSubmit={() => {
                sendEvent({
                  name: "Filtered failed tests",
                });
              }}
            />
            <TaskSelector
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              buildVariant={variantName}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              projectIdentifier={projectIdentifier}
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
            variantName={variantName}
          />
          <TableWrapper>
            <HistoryTable
              finalRowCopy="End of variant history"
              loading={loading}
              loadMoreItems={handleLoadMore}
            >
              {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
              {VariantHistoryRow}
            </HistoryTable>
          </TableWrapper>
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

const VariantHistory = () => (
  <HistoryTableProvider>
    <VariantHistoryContents />
  </HistoryTableProvider>
);
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export default VariantHistory;
