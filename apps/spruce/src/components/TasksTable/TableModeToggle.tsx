import { Dispatch, SetStateAction } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  TableMode,
  setTableMode as setTableModeStorage,
} from "constants/featureFlags";

export const TableModeToggle: React.FC<{
  tableMode: TableMode;
  setTableMode: Dispatch<SetStateAction<TableMode>>;
}> = ({ setTableMode, tableMode }) => (
  <Container>
    <SegmentedControl
      label="Past status view"
      onChange={(v) => {
        setTableMode(v as TableMode);
        setTableModeStorage(v as TableMode);
      }}
      size="small"
      value={tableMode}
    >
      <SegmentedControlOption value="default">Default</SegmentedControlOption>
      <SegmentedControlOption value="inline">Inline</SegmentedControlOption>
      <SegmentedControlOption value="new-column">
        Additional Column
      </SegmentedControlOption>
    </SegmentedControl>
  </Container>
);

const Container = styled.div`
  margin-bottom: ${size.m};
`;
