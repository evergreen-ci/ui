import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Body } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { Accordion } from "components/Accordion";
import { TaskBuildVariantField } from "../types";
import FailedTestGroupTable from "./FailedTestGroupTable";

interface FailedTestGroupProps {
  testName: string;
  tasks: TaskBuildVariantField[];
}

const FailedTestGroup: React.FC<FailedTestGroupProps> = ({
  tasks,
  testName,
}) => (
  <Accordion
    title={
      <Body weight="medium">
        {testName} failed on {tasks.length} {pluralize("task", tasks.length)}
      </Body>
    }
  >
    <StyledCard>
      <FailedTestGroupTable tasks={tasks} />
    </StyledCard>
  </Accordion>
);

const StyledCard = styled(Card)`
  margin-top: ${size.xs};
`;
export default FailedTestGroup;
