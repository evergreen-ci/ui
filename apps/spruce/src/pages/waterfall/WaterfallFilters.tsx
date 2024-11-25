import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { WaterfallPagination } from "gql/generated/types";
import { DateFilter } from "./DateFilter";
import { NameFilter } from "./NameFilter";
import { PaginationButtons } from "./PaginationButtons";
import { RequesterFilter } from "./RequesterFilter";
import { StatusFilter } from "./StatusFilter";

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
        <NameFilter />
      </FilterItem>
      <ComboboxFilterItem>
        <StatusFilter />
      </ComboboxFilterItem>
      <ComboboxFilterItem>
        <RequesterFilter />
      </ComboboxFilterItem>
      <FilterItem>
        <DateFilter />
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
  flex: 1;
`;

// Combobox's overflow handling requires a fixed width
const ComboboxFilterItem = styled.div`
  width: 250px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${size.s};
`;
