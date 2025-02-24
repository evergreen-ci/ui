import styled from "@emotion/styled";
import { useWaterfallAnalytics } from "analytics";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { BuildVariantFilter } from "./BuildVariantFilter";
import { DateFilter } from "./DateFilter";
import { PaginationButtons } from "./PaginationButtons";
import { RequesterFilter } from "./RequesterFilter";
import { StatusFilter } from "./StatusFilter";
import { TaskFilter } from "./TaskFilter";
import { Pagination } from "./types";
import { WaterfallMenu } from "./WaterfallMenu";

type WaterfallFiltersProps = {
  projectIdentifier: string;
  pagination: Pagination | undefined;
};
export const WaterfallFilters: React.FC<WaterfallFiltersProps> = ({
  pagination,
  projectIdentifier,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

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
        <DateFilter />
      </DateFilterItem>
      <ProjectFilterItem>
        <ProjectSelect
          getRoute={getWaterfallRoute}
          onSubmit={(project: string) => {
            sendEvent({
              name: "Changed project",
              project,
            });
          }}
          selectedProjectIdentifier={projectIdentifier}
        />
      </ProjectFilterItem>
      <WaterfallMenu projectIdentifier={projectIdentifier} />
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
