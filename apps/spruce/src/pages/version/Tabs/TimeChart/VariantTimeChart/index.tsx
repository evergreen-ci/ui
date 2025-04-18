import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  VersionGanttChartQuery,
  VersionGanttChartQueryVariables,
} from "gql/generated/types";
import { VERSION_GANTT_CHART } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryVariables } from "../../useQueryVariables";
import TimeChartGraph from "../TimeChartGraph";
import { transformVersionDataToVariantGanttChartData } from "../utils";

interface Props {
  versionId: string;
}

const VariantTimeChart: React.FC<Props> = ({ versionId }) => {
  const dispatchToast = useToastContext();
  const { search } = useLocation();

  const queryVariables = useQueryVariables(search, versionId);
  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    VersionGanttChartQuery,
    VersionGanttChartQueryVariables
  >(VERSION_GANTT_CHART, {
    variables: {
      versionId,
      buildVariantsOptions: {
        variants: queryVariables.taskFilterOptions.variant
          ? [queryVariables.taskFilterOptions.variant]
          : undefined,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Error fetching patch tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });

  return (
    <TimeChartGraph
      data={transformVersionDataToVariantGanttChartData(data)}
      loading={loading}
    />
  );
};

export default VariantTimeChart;
