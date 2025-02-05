import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { ProjectBanner, RepotrackerBanner } from "components/Banners";
import FilterChips, { useFilterChipQueryParams } from "components/FilterChips";
import { ProjectSelect } from "components/ProjectSelect";
import { PageWrapper } from "components/styles";
import { ALL_VALUE } from "components/TreeSelect";
import TupleSelectWithRegexConditional from "components/TupleSelectWithRegexConditional";
import { WaterfallModal } from "components/WaterfallModal";
import {
  SEEN_WATERFALL_BETA_MODAL,
  CURRENT_PROJECT,
  CY_DISABLE_COMMITS_WELCOME_MODAL,
} from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { getCommitsRoute, slugs } from "constants/routes";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  MainlineCommitsQuery,
  MainlineCommitsQueryVariables,
  ProjectHealthView,
} from "gql/generated/types";
import { MAINLINE_COMMITS, SPRUCE_CONFIG } from "gql/queries";
import {
  useAdminBetaFeatures,
  usePageTitle,
  usePolling,
  useUpsertQueryParams,
} from "hooks";
import { useProjectRedirect } from "hooks/useProjectRedirect";
import { useQueryParam } from "hooks/useQueryParam";
import { ProjectFilterOptions, MainlineCommitQueryParams } from "types/commits";
import { array, queryString, validators } from "utils";
import { isProduction } from "utils/environmentVariables";
import { CommitsWrapper } from "./CommitsWrapper";
import CommitTypeSelector from "./CommitTypeSelector";
import { useCommitLimit } from "./hooks/useCommitLimit";
import { PaginationButtons } from "./PaginationButtons";
import { StatusSelect } from "./StatusSelect";
import { getMainlineCommitsQueryVariables, getFilterStatus } from "./utils";
import { ViewToggle } from "./ViewToggle";
import { WaterfallMenu } from "./WaterfallMenu";

const { toArray } = array;
const { getString, parseQueryString } = queryString;
const { validateRegexp } = validators;

const shouldDisableForTest =
  !isProduction() && Cookies.get(CY_DISABLE_COMMITS_WELCOME_MODAL) === "true";

const Commits = () => {
  const dispatchToast = useToastContext();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [ref, limit, isResizing] = useCommitLimit<HTMLDivElement>();
  const parsed = parseQueryString(search);
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  usePageTitle(`Project Health | ${projectIdentifier}`);

  const { adminBetaSettings } = useAdminBetaFeatures();
  const showWaterfallBetaModal =
    Cookies.get(SEEN_WATERFALL_BETA_MODAL) !== "true" &&
    adminBetaSettings?.spruceWaterfallEnabled;

  const sendAnalyticsEvent = (id: string, identifier: string) => {
    sendEvent({
      name: "Redirected to project identifier",
      "project.id": id,
      "project.identifier": identifier,
    });
  };
  const { isRedirecting } = useProjectRedirect({
    sendAnalyticsEvent,
    shouldRedirect: true,
  });

  const recentlySelectedProject = Cookies.get(CURRENT_PROJECT);
  // Push default project to URL if there isn't a project in
  // the URL already and an mci-project-cookie does not exist.
  const { data: spruceData } = useQuery<
    SpruceConfigQuery,
    SpruceConfigQueryVariables
  >(SPRUCE_CONFIG, {
    skip: !!projectIdentifier || !!recentlySelectedProject,
  });

  useEffect(() => {
    if (!projectIdentifier) {
      if (recentlySelectedProject) {
        navigate(getCommitsRoute(recentlySelectedProject), { replace: true });
      } else if (spruceData) {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        navigate(getCommitsRoute(spruceData?.spruceConfig.ui.defaultProject), {
          replace: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdentifier, spruceData]);

  const statusFilters = toArray(parsed[ProjectFilterOptions.Status]);
  const variantFilters = toArray(parsed[ProjectFilterOptions.BuildVariant]);
  const taskFilters = toArray(parsed[ProjectFilterOptions.Task]);
  const [viewFilter] = useQueryParam(
    ProjectFilterOptions.View,
    "" as ProjectHealthView,
  );
  const requesterFilters = toArray(
    parsed[MainlineCommitQueryParams.Requester],
  ).filter((r) => r !== ALL_VALUE);
  const skipOrderNumberParam = getString(
    parsed[MainlineCommitQueryParams.SkipOrderNumber],
  );
  const revisionParam = getString(parsed[MainlineCommitQueryParams.Revision]);

  const parsedSkipNum = parseInt(skipOrderNumberParam, 10);
  const skipOrderNumber = Number.isNaN(parsedSkipNum)
    ? undefined
    : parsedSkipNum;
  const revision = revisionParam.length ? revisionParam : undefined;

  const filterState = {
    statuses: statusFilters,
    variants: variantFilters,
    tasks: taskFilters,
    requesters: requesterFilters,
    view: viewFilter || ProjectHealthView.Failed,
  };

  const variables = getMainlineCommitsQueryVariables({
    mainlineCommitOptions: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      projectIdentifier,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      skipOrderNumber,
      limit,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      revision,
    },
    filterState,
  });

  const { hasFilters, hasTasks } = getFilterStatus(filterState);

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(MAINLINE_COMMITS, {
    skip: !projectIdentifier || isRedirecting || isResizing,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    variables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { mainlineCommits } = data || {};
  const { nextPageOrderNumber, prevPageOrderNumber, versions } =
    mainlineCommits || {};

  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    queryParamsToDisplay,
    urlParamToTitleMap,
  );
  const onSubmit = useUpsertQueryParams();

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const onSubmitTupleSelect = ({ category, type, value }) => {
    onSubmit({ category, value });
    switch (category) {
      case ProjectFilterOptions.BuildVariant:
        sendEvent({ name: "Filtered by build variant", type });
        break;
      case ProjectFilterOptions.Task:
        sendEvent({ name: "Filtered by task", type });
        break;
      default:
    }
  };

  return (
    <PageWrapper>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <ProjectBanner projectIdentifier={projectIdentifier} />
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      <RepotrackerBanner projectIdentifier={projectIdentifier} />
      <PageContainer>
        <HeaderWrapper>
          <ElementWrapper width="35">
            <TupleSelectWithRegexConditional
              onSubmit={onSubmitTupleSelect}
              options={tupleSelectOptions}
              validator={validateRegexp}
              validatorErrorMessage="Invalid Regular Expression"
            />
          </ElementWrapper>
          <ElementWrapper width="20">
            <StatusSelect />
          </ElementWrapper>
          <ElementWrapper width="20">
            <CommitTypeSelector />
          </ElementWrapper>
          <ElementWrapper width="25">
            <ProjectSelect
              getRoute={getCommitsRoute}
              onSubmit={(p: string) => {
                sendEvent({
                  name: "Changed project",
                  project: p,
                });
              }}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              selectedProjectIdentifier={projectIdentifier}
            />
          </ElementWrapper>
          <WaterfallMenu />
        </HeaderWrapper>
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
        <PaginationWrapper>
          {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
          <ViewToggle identifier={projectIdentifier} />
          <PaginationButtons
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            nextPageOrderNumber={nextPageOrderNumber}
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            prevPageOrderNumber={prevPageOrderNumber}
          />
        </PaginationWrapper>
        <div ref={ref}>
          <CommitsWrapper
            hasFilters={hasFilters}
            hasTaskFilter={hasTasks}
            isLoading={
              (loading && !versions) ||
              !projectIdentifier ||
              isRedirecting ||
              isResizing
            }
            revision={revision}
            versions={versions}
          />
        </div>
      </PageContainer>
      {!shouldDisableForTest && showWaterfallBetaModal && projectIdentifier && (
        <WaterfallModal projectIdentifier={projectIdentifier} />
      )}
    </PageWrapper>
  );
};

const queryParamsToDisplay = new Set([
  ProjectFilterOptions.BuildVariant,
  ProjectFilterOptions.Task,
]);

const urlParamToTitleMap = {
  [ProjectFilterOptions.BuildVariant]: "Variant",
  [ProjectFilterOptions.Task]: "Task",
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${size.s};
`;
const BadgeWrapper = styled.div`
  margin: ${size.s} 0;
`;
const PaginationWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.xs};
  justify-content: flex-end;
  padding-bottom: ${size.xs};
`;

const tupleSelectOptions = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search build variants",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search task names",
  },
];

const ElementWrapper = styled.div`
  ${({ width }: { width: string }) => `width: ${width}%;`}
`;

export default Commits;
