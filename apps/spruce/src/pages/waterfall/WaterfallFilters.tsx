import { useCallback } from "react";
import styled from "@emotion/styled";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { DateFilter } from "components/DateFilter";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { BuildVariantFilter } from "./BuildVariantFilter";
import { walkthroughSteps, waterfallGuideId } from "./constants";
import { PaginationButtons } from "./PaginationButtons";
import { RequesterFilter } from "./RequesterFilter";
import { StatusFilter } from "./StatusFilter";
import { TaskFilter } from "./TaskFilter";
import { Pagination, WaterfallFilterOptions } from "./types";
import { WaterfallMenu } from "./WaterfallMenu";

type WaterfallFiltersProps = {
  omitInactiveBuilds: boolean;
  projectIdentifier: string;
  pagination: Pagination | undefined;
  restartWalkthrough: () => void;
  setOmitInactiveBuilds: (value: boolean) => void;
};

export const WaterfallFilters: React.FC<WaterfallFiltersProps> = ({
  omitInactiveBuilds,
  pagination,
  projectIdentifier,
  restartWalkthrough,
  setOmitInactiveBuilds,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

  const [queryParams, setQueryParams] = useQueryParams();
  const [statuses] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [date] = useQueryParam<string>(WaterfallFilterOptions.Date, "");

  const projectSelectRoute = useCallback(
    (identifier: string) =>
      getWaterfallRoute(identifier, { statusFilters: statuses }),
    [statuses],
  );

  return (
    <Container>
      <BVTaskFilterItem>
        <BuildVariantFilter />
      </BVTaskFilterItem>
      <BVTaskFilterItem>
        <TaskFilter />
      </BVTaskFilterItem>
      <StatusFilterItem>
        <StatusFilter />
      </StatusFilterItem>
      <RequesterFilterItem>
        <RequesterFilter />
      </RequesterFilterItem>
      <DateFilterItem>
        <DateFilter
          dataCyProps={{ [waterfallGuideId]: walkthroughSteps[3].targetId }}
          onChange={(newDate) => {
            setQueryParams({
              ...queryParams,
              [WaterfallFilterOptions.MaxOrder]: undefined,
              [WaterfallFilterOptions.MinOrder]: undefined,
              [WaterfallFilterOptions.Date]: newDate,
            });
            sendEvent({ name: "Filtered by date" });
          }}
          showLabel
          value={date}
        />
      </DateFilterItem>
      <ProjectFilterItem>
        <ProjectSelect
          getProjectRoute={projectSelectRoute}
          onSubmit={(project: string) => {
            sendEvent({
              name: "Changed project",
              project,
            });
          }}
          selectedProjectIdentifier={projectIdentifier}
        />
      </ProjectFilterItem>
      <WaterfallMenu
        omitInactiveBuilds={omitInactiveBuilds}
        projectIdentifier={projectIdentifier}
        restartWalkthrough={restartWalkthrough}
        setOmitInactiveBuilds={setOmitInactiveBuilds}
      />
      <PaginationButtons pagination={pagination} />
    </Container>
  );
};

const BVTaskFilterItem = styled.div`
  flex-basis: 25%;
`;

// Combobox's overflow handling requires a fixed width
const StatusFilterItem = styled.div`
  min-width: 185px;
  flex-shrink: 0;
  flex-basis: 12%;
`;

const RequesterFilterItem = styled.div`
  min-width: 200px;
  flex-shrink: 0;
  flex-basis: 12%;
`;

const DateFilterItem = styled.div`
  flex-basis: content;
`;

const ProjectFilterItem = styled.div`
  flex-basis: 20%;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
`;
