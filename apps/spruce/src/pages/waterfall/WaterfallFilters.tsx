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
      <FilterItem width={35}>
        <NameFilter />
      </FilterItem>
      <FilterItem width={25}>
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
  ${({ width }: { width?: number }) =>
    `flex-basis: ${width ? `${width}}%` : "300px"};`}
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${size.s};
`;
