import { GANTT_CHART_COLUMN_HEADERS, TaskDurationData } from "./types";
import {
  transformTaskDurationDataToTaskGanttChartData,
  transformTaskDurationDataToVariantGanttChartData,
} from "./utils";

describe("transformVersionDataToVariantGanttChartData", () => {
  it("should transform version data to variant Gantt chart data", () => {
    const data = [
      {
        buildVariant: "ubuntu16.04",
        buildVariantDisplayName: "Ubuntu 16.04",
        displayName: "check_codegen",
        finishTime: "2025-04-19T00:00:00Z",
        startTime: "2025-04-18T00:00:00Z",
      },
      {
        buildVariant: "ubuntu16.04",
        buildVariantDisplayName: "Ubuntu 16.04",
        displayName: "compile",
        finishTime: null,
        startTime: "2025-04-18T00:00:00Z",
      },
    ];

    const result = transformTaskDurationDataToVariantGanttChartData(
      data as unknown as TaskDurationData[],
    );
    expect(result).toEqual([
      GANTT_CHART_COLUMN_HEADERS,
      [
        "ubuntu16.04",
        "Ubuntu 16.04",
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
    const result = transformTaskDurationDataToVariantGanttChartData(undefined);
    expect(result).toEqual([GANTT_CHART_COLUMN_HEADERS]);
  });
});

describe("transformVersionDataToTaskGanttChartData", () => {
  it("should transform version data to task Gantt chart data", () => {
    const data = [
      {
        buildVariant: "ubuntu16.04",
        displayName: "check_codegen",
        finishTime: "2025-04-19T00:00:00Z",
        id: "check_codegen_id",
        startTime: "2025-04-18T00:00:00Z",
      },
      {
        buildVariant: "ubuntu16.04",
        displayName: "compile",
        finishTime: null,
        id: "compile_id",
        startTime: "2025-04-18T00:00:00Z",
      },
    ];

    const result = transformTaskDurationDataToTaskGanttChartData(
      data as unknown as TaskDurationData[],
    );

    expect(result).toEqual([
      GANTT_CHART_COLUMN_HEADERS,
      [
        "check_codegen_id",
        "check_codegen",
        "ubuntu16.04",
        new Date("2025-04-18T00:00:00Z"),
        new Date("2025-04-19T00:00:00Z"),
        null,
        100,
        null,
      ],
    ]);
  });

  it("should handle empty data", () => {
    const result = transformTaskDurationDataToTaskGanttChartData(undefined);
    expect(result).toEqual([GANTT_CHART_COLUMN_HEADERS]);
  });
});
