import styled from "@emotion/styled";
import { useWaterfallAnalytics } from "analytics";
import { ProjectSelect } from "components/ProjectSelect";
import { getWaterfallRoute } from "constants/routes";
import { size } from "constants/tokens";
import { NameFilter } from "./NameFilter";
import { RequesterFilter } from "./RequesterFilter";

type WaterfallFiltersProps = {
  projectIdentifier: string;
};
export const WaterfallFilters: React.FC<WaterfallFiltersProps> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

  return (
    <Container>
      <FilterItem>
        <NameFilter />
      </FilterItem>
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
    </Container>
  );
};

// Temporary - update styles as more filters are added.
const FilterItem = styled.div`
  flex-basis: 33%;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: ${size.s};
`;
