import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { TaskBuildVariantField } from "../types";
import FailedTestGroup from "./FailedTestGroup";

interface GroupedTestMapListProps {
  groupedTestsMapEntries: [string, TaskBuildVariantField[]][];
}
const GroupedTestMapList: React.FC<GroupedTestMapListProps> = ({
  groupedTestsMapEntries,
}) => (
  <>
    {groupedTestsMapEntries.map(([testName, tasks]) => (
      <SpacedDiv>
        <FailedTestGroup key={testName} tasks={tasks} testName={testName} />
      </SpacedDiv>
    ))}
  </>
);

const SpacedDiv = styled.div`
  margin-top: ${size.s};
`;

export default GroupedTestMapList;
