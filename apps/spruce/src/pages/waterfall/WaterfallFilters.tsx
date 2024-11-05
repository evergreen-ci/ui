import styled from "@emotion/styled";
import { useWaterfallAnalytics } from "analytics";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { size } from "constants/tokens";
import { WaterfallPagination } from "gql/generated/types";
import { PaginationButtons } from "./PaginationButtons";
import { RequesterFilter } from "./RequesterFilter";

type WaterfallFiltersProps = {
  projectIdentifier: string;
  pagination: WaterfallPagination | undefined;
};
export const WaterfallFilters: React.FC<WaterfallFiltersProps> = ({
  pagination,
  projectIdentifier,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

  return (
    <Container>
      <FilterItem>
        <RequesterFilter />
      </FilterItem>
      <FilterItem>
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
      </FilterItem>
      <PaginationButtons pagination={pagination} />
    </Container>
  );
};

// Temporary - update styles as more filters are added.
const FilterItem = styled.div`
  width: 300px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${size.s};
`;
