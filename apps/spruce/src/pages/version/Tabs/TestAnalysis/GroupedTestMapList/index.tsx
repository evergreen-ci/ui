import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { TaskBuildVariantField } from "../types";
import FailedTestGroup from "./FailedTestGroup";

interface GroupedTestMapListProps {
  groupedTestsMapEntries: [string, TaskBuildVariantField[]][];
}
const GroupedTestMapList: React.FC<GroupedTestMapListProps> = ({
  groupedTestsMapEntries,
}) => (
  <Container>
    {groupedTestsMapEntries.map(([testName, tasks]) => (
      <FailedTestGroup key={testName} tasks={tasks} testName={testName} />
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
`;

export default GroupedTestMapList;
