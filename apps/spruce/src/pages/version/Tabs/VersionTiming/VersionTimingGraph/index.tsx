import { palette } from "@leafygreen-ui/palette";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import Chart from "react-google-charts";
import { useNavigate } from "react-router-dom";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { VersionPageTabs } from "types/patch";
import { applyStrictRegex } from "utils/string";
import { GanttChartData } from "../types";

const { black, green } = palette;
const CHART_ROW_HEIGHT_IN_PIXELS = 42;
const MINIMUM_CHART_HEIGHT_IN_PIXELS = 400;
const DEFAULT_LABEL_MAX_WIDTH = 300;
const CHARACTER_WIDTH = 8;

interface Props {
  versionId: string;
  data: GanttChartData;
  loading: boolean;
  dataType: "task" | "variant";
}

const VersionTimingGraph: React.FC<Props> = ({
  data,
  dataType,
  loading,
  versionId,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <ListSkeleton />;
  }

  if (!data || data.length === 1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: `${MINIMUM_CHART_HEIGHT_IN_PIXELS}px`,
        }}
      >
        <p>No data available</p>
      </div>
    );
  }

  const labelMaxWidth = data.reduce((acc: number, row) => {
    let labelWidth = DEFAULT_LABEL_MAX_WIDTH;
    if (row[1] && typeof row[1] === "string") {
      labelWidth = row[1].length * CHARACTER_WIDTH;
    }
    return Math.max(acc, labelWidth);
  }, DEFAULT_LABEL_MAX_WIDTH);

  return (
    <Chart
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper?.getChart();
            const selection = chart?.getSelection();

            if (selection && selection.length > 0) {
              const selectedItem = selection[0];
              const rowIndex = selectedItem.row;
              const selectedId = chartWrapper
                ?.getDataTable()
                ?.getValue(rowIndex, 0) as string;

              if (dataType === "task") {
                navigate(getTaskRoute(selectedId));
              } else {
                navigate(
                  getVersionRoute(versionId, {
                    tab: VersionPageTabs.VersionTiming,
                    variant: applyStrictRegex(selectedId),
                  }),
                );
              }
            }
          },
        },
      ]}
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
          labelMaxWidth: labelMaxWidth,
          labelStyle: {
            fontName: "Euclid Circular A",
            fontSize: 14,
          },
          palette: [
            {
              dark: green.dark1,
              light: green.dark1,
              color: black,
            },
          ],
        },
      }}
      width="100%"
    />
  );
};

export default VersionTimingGraph;
