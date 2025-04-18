import { useLocation } from "react-router-dom";
import { useQueryVariables } from "../useQueryVariables";
import TaskTimeChart from "./TaskTimeChart";
import VariantTimeChart from "./VariantTimeChart";

interface Props {
  versionId: string;
  taskCount: number;
}

const TimeChart: React.FC<Props> = ({ taskCount, versionId }) => {
  const { search } = useLocation();
  const queryVariables = useQueryVariables(search, versionId);

  return queryVariables.taskFilterOptions.variant ? (
    <TaskTimeChart taskCount={taskCount} versionId={versionId} />
  ) : (
    <VariantTimeChart versionId={versionId} />
  );
};

export default TimeChart;
