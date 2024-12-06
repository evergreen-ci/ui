import { useTransition } from "react";
import { useQuery } from "@apollo/client";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { fromZonedTime } from "date-fns-tz";
import { useParams } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import { navBarHeight } from "components/Header/Navbar";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { utcTimeZone } from "constants/time";
import { WaterfallQuery, WaterfallQueryVariables } from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { useSpruceConfig, useUserTimeZone } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { isBeta } from "utils/environmentVariables";
import { jiraLinkify } from "utils/string";
import { VERSION_LIMIT } from "./styles";
import { WaterfallFilterOptions } from "./types";
import { WaterfallFilters } from "./WaterfallFilters";
import { WaterfallGrid } from "./WaterfallGrid";

const Waterfall: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const [, startTransition] = useTransition();
  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    new Set([WaterfallFilterOptions.BuildVariant, WaterfallFilterOptions.Task]),
  );

  const { sendEvent } = useWaterfallAnalytics();

  const [maxOrder] = useQueryParam<number>(WaterfallFilterOptions.MaxOrder, 0);
  const [minOrder] = useQueryParam<number>(WaterfallFilterOptions.MinOrder, 0);
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");

  const timezone = useUserTimeZone() ?? utcTimeZone;

  // Temporary useQuery for testing
  const { data, loading } = useQuery<WaterfallQuery, WaterfallQueryVariables>(
    WATERFALL,
    {
      variables: {
        options: {
          projectIdentifier: projectIdentifier!,
          limit: VERSION_LIMIT,
          maxOrder,
          minOrder,
          date: date ? fromZonedTime(date, timezone) : undefined,
        },
      },
      pollInterval: DEFAULT_POLL_INTERVAL,
    },
  );

  return (
    <>
      <Global styles={navbarStyles} />
      <PageContainer data-cy="waterfall-page">
        {isBeta() && (
          <Banner>
            <strong>Thanks for using the Waterfall Alpha!</strong> Feedback?
            Open a ticket within the project epic{" "}
            {jiraLinkify("DEVPROD-3976", jiraHost ?? "")}.
          </Banner>
        )}
        <WaterfallFilters
          // Using a key rerenders the filter components so that uncontrolled components can compute a new initial state
          pagination={data?.waterfall.pagination}
          projectIdentifier={projectIdentifier ?? ""}
        />
        <FilterBadges
          badges={badges}
          onClearAll={() => {
            sendEvent({ name: "Deleted all filter badges" });
            startTransition(handleClearAll);
          }}
          onRemove={(b) => {
            sendEvent({ name: "Deleted one filter badge" });
            startTransition(() => handleOnRemove(b));
          }}
        />
        {!data || loading ? (
          <TableSkeleton
            data-cy="waterfall-skeleton"
            numCols={VERSION_LIMIT + 1}
            numRows={15}
          />
        ) : (
          <WaterfallGrid
            key={projectIdentifier}
            data={data}
            projectIdentifier={projectIdentifier ?? ""}
          />
        )}
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
  padding: ${size.m};
  // Setting overflow-x allows floating content to be correctly positioned on the page.
  overflow-x: hidden;
`;

/* Safari performance of the waterfall chokes if using overflow-y: scroll, so we need the page to scroll instead.
    Update navbar layout to accommodate this. */
const navbarStyles = css`
  header {
    position: unset !important;
  }
  #banner-container {
    padding-top: ${navBarHeight};
  }
  nav {
    position: fixed !important;
    width: 100%;
    z-index: 1;
  }
`;

export default Waterfall;
