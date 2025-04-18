import {
  GANTT_CHART_COLUMN_HEADERS,
  TaskDurationData,
  VersionGanttChartData,
} from "./types";
import {
  transformVersionDataToTaskGanttChartData,
  transformVersionDataToVariantGanttChartData,
} from "./utils";

describe("transformVersionDataToVariantGanttChartData", () => {
  it("should transform version data to variant Gantt chart data", () => {
    const data = {
      version: {
        buildVariants: [
          {
            displayName: "Ubuntu 16.04",
            tasks: [
              {
                displayName: "check_codegen",
                startTime: "2025-04-18T00:00:00Z",
                finishTime: "2025-04-18T00:00:00Z",
              },
              {
                displayName: "compile",
                startTime: "2025-04-19T00:00:00Z",
                finishTime: "2025-04-19T00:00:00Z",
              },
            ],
          },
        ],
      },
    };

    const result = transformVersionDataToVariantGanttChartData(
      data as unknown as VersionGanttChartData,
    );
    expect(result).toEqual([
      GANTT_CHART_COLUMN_HEADERS,
      [
        "Ubuntu 16.04",
        "Ubuntu 16.04",
        "",
        new Date("2025-04-18T00:00:00Z"),
        new Date("2025-04-19T00:00:00Z"),
        86400000,
        100,
        null,
      ],
    ]);
  });

  it("should handle empty data", () => {
    const result = transformVersionDataToVariantGanttChartData(undefined);
    expect(result).toEqual([GANTT_CHART_COLUMN_HEADERS]);
  });
});

describe("transformVersionDataToTaskGanttChartData", () => {
  it("should transform version data to task Gantt chart data", () => {
    const data = [
      {
        displayName: "check_codegen",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: "2025-04-19T00:00:00Z",
      },
      {
        displayName: "compile",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: null,
      },
    ];

    const result = transformVersionDataToTaskGanttChartData(
      data as unknown as TaskDurationData[],
    );

    expect(result).toEqual([
      GANTT_CHART_COLUMN_HEADERS,
      [
        "check_codegen",
        "check_codegen",
        "",
        new Date("2025-04-18T00:00:00Z"),
        new Date("2025-04-19T00:00:00Z"),
        null,
        100,
        null,
      ],
    ]);
  });

  it("should handle empty data", () => {
    const result = transformVersionDataToTaskGanttChartData(undefined);
    expect(result).toEqual([GANTT_CHART_COLUMN_HEADERS]);
  });
});
