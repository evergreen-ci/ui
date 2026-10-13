import { useEffect, useRef } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { Skeleton } from "@via-ds/components/skeleton";
import { Body, H2 } from "@via-ds/components/typography";
import { useParams } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  SentryBreadcrumbTypes,
  leaveBreadcrumb,
} from "@evg-ui/lib/utils/errorReporting";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
import { ProjectBanner } from "components/Banners";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import {
  ColumnPaginationButtons,
  HistoryTableTestSearch,
  constants,
  context,
  hooks,
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
import styles from "./index.module.css";
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
  >(
    MAINLINE_COMMITS_FOR_HISTORY,
    projectIdentifier && variantName
      ? {
          variables: {
            mainlineCommitsOptions: {
              projectIdentifier,
              limit: 10,
              shouldCollapse: true,
            },
            buildVariantOptions: {
              variants: [applyStrictRegex(variantName)],
              includeBaseTasks: false,
            },
          },
          notifyOnNetworkStatusChange: true, // This is so that we can show the loading state
          fetchPolicy: "no-cache", // This is because we already cache the data in the history table
        }
      : skipToken,
  );

  const variantDisplayNameRef = useRef<string | undefined>(undefined);
  if (!variantDisplayNameRef.current) {
    variantDisplayNameRef.current = data?.mainlineCommits?.versions?.find(
      (v) => v.version,
    )?.version?.buildVariants?.[0]?.displayName;
  }
  const variantDisplayName = variantDisplayNameRef.current;

  const prevLoadingRef = useRef(loading);
  useEffect(() => {
    // Trigger only when loading transitions from true to false (query completed).
    if (prevLoadingRef.current && !loading && data?.mainlineCommits) {
      leaveBreadcrumb(
        "Loaded more commits for variant history",
        {
          projectIdentifier,
          variantName,
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
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <div className={styles.centerPage}>
        <div className={styles.pageHeader}>
          <H2>Variant History</H2>
          <div className={styles.variantMetadata}>
            <Body>
              <strong>Identifier:</strong> {variantName}
            </Body>
            <Body> | </Body>
            {variantDisplayName ? (
              <Body>
                <strong>Display Name:</strong> {variantDisplayName}
              </Body>
            ) : (
              <Skeleton isLoading>
                <Body className={styles.displayNamePlaceholder}>
                  Loading display name
                </Body>
              </Skeleton>
            )}
          </div>
          <div className={styles.pageHeaderContent}>
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
          </div>
        </div>
        <div className={styles.paginationFilterWrapper}>
          <div className={styles.badgeWrapper}>
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
          </div>
          <ColumnPaginationButtons
            onClickNext={() =>
              sendEvent({ name: "Changed page", direction: "next" })
            }
            onClickPrev={() =>
              sendEvent({ name: "Changed page", direction: "previous" })
            }
          />
        </div>
        <div>
          <ColumnHeaders
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            projectIdentifier={projectIdentifier}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            variantName={variantName}
          />
          <div className={styles.tableWrapper}>
            <HistoryTable
              finalRowCopy="End of variant history"
              loading={loading}
              loadMoreItems={handleLoadMore}
            >
              {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
              {VariantHistoryRow}
            </HistoryTable>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const VariantHistory = () => (
  <HistoryTableProvider>
    <VariantHistoryContents />
  </HistoryTableProvider>
);

export default VariantHistory;
