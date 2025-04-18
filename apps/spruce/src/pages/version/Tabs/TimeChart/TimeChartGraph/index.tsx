import { Spinner } from "@leafygreen-ui/loading-indicator";
import { palette } from "@leafygreen-ui/palette";
import Chart from "react-google-charts";
import { GanttChartData } from "../types";

const CHART_ROW_HEIGHT_IN_PIXELS = 42;
const MINIMUM_CHART_HEIGHT_IN_PIXELS = 400;

interface Props {
  data: GanttChartData;
  loading: boolean;
}

const TimeChartGraph: React.FC<Props> = ({ data, loading }) => {
  if (loading || !data || data.length === 1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: `${MINIMUM_CHART_HEIGHT_IN_PIXELS}px`,
        }}
      >
        {loading ? <Spinner /> : <p>No data available</p>}
      </div>
    );
  }

  return (
    <Chart
      chartType="Gantt"
      data={data}
      height={Math.max(
        data.length * CHART_ROW_HEIGHT_IN_PIXELS,
        MINIMUM_CHART_HEIGHT_IN_PIXELS,
      )}
      options={{
        timeline: {
          groupByRowLabel: false,
          showRowLabels: false,
        },
        gantt: {
          criticalPathEnabled: false,
          palette: [
            {
              dark: palette.green.dark1,
              light: palette.green.dark1,
              color: palette.black,
            },
          ],
        },
      }}
      width="100%"
    />
  );
};

export default TimeChartGraph;
