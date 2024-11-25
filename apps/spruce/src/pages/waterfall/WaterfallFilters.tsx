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
      <NameFilterItem>
        <NameFilter />
      </NameFilterItem>
      <ComboboxFilterItem>
        <StatusFilter />
      </ComboboxFilterItem>
      <ComboboxFilterItem>
        <RequesterFilter />
      </ComboboxFilterItem>
      <DateFilterItem>
        <DateFilter />
      </DateFilterItem>
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

const NameFilterItem = styled.div`
  flex-basis: 30%;
`;

const FilterItem = styled.div`
  flex-basis: 20%;
`;

// Combobox's overflow handling requires a fixed width
const ComboboxFilterItem = styled.div`
  width: 220px;
  flex-shrink: 0;
`;

const DateFilterItem = styled.div`
  flex-basis: content;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${size.s};
`;
