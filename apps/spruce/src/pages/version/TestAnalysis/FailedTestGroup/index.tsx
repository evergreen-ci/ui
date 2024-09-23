import { Body } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
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
    <FailedTestGroupTable tasks={tasks} />
  </Accordion>
);

export default FailedTestGroup;
