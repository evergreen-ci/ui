import {
  ChildVersionTimingData,
  GANTT_CHART_COLUMN_HEADERS,
  TaskDurationData,
} from "./types";
import {
  getDownstreamProjectRowId,
  getDownstreamVersionId,
  transformTaskDurationDataToTaskGanttChartData,
  transformTaskDurationDataToVariantGanttChartData,
} from "./utils";

describe("transformVersionDataToVariantGanttChartData", () => {
  it("should transform version data to variant Gantt chart data", () => {
    const data = [
      {
        buildVariantDisplayName: "Ubuntu 16.04",
        buildVariant: "ubuntu16.04",
        displayName: "check_codegen",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: "2025-04-19T00:00:00Z",
      },
      {
        buildVariantDisplayName: "Ubuntu 16.04",
        buildVariant: "ubuntu16.04",
        displayName: "compile",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: null,
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

  it("should include completed downstream projects with distinct row IDs", () => {
    const childVersions = [
      {
        id: "child_version",
        projectMetadata: { identifier: "pine" },
        startTime: "2025-04-18T01:00:00Z",
        finishTime: "2025-04-19T02:00:00Z",
      },
      {
        id: "unfinished_child_version",
        projectMetadata: { identifier: "unfinished" },
        startTime: "2025-04-18T01:00:00Z",
        finishTime: null,
      },
    ] as unknown as ChildVersionTimingData[];

    const result = transformTaskDurationDataToVariantGanttChartData(
      undefined,
      childVersions,
    );

    expect(result).toEqual([
      GANTT_CHART_COLUMN_HEADERS,
      [
        getDownstreamProjectRowId("child_version"),
        "pine (downstream)",
        "",
        new Date("2025-04-18T01:00:00Z"),
        new Date("2025-04-19T02:00:00Z"),
        null,
        100,
        null,
      ],
    ]);
    expect(getDownstreamProjectRowId("child_version")).not.toBe(
      "child_version",
    );
    expect(
      getDownstreamVersionId(getDownstreamProjectRowId("child_version")),
    ).toBe("child_version");
    expect(getDownstreamVersionId("parent_variant")).toBeUndefined();
  });
});

describe("transformVersionDataToTaskGanttChartData", () => {
  it("should transform version data to task Gantt chart data", () => {
    const data = [
      {
        id: "check_codegen_id",
        displayName: "check_codegen",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: "2025-04-19T00:00:00Z",
        buildVariant: "ubuntu16.04",
      },
      {
        id: "compile_id",
        displayName: "compile",
        startTime: "2025-04-18T00:00:00Z",
        finishTime: null,
        buildVariant: "ubuntu16.04",
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
