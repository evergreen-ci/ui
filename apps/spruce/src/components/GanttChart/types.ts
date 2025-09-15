export const GANTT_CHART_COLUMN_HEADERS = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "string", label: "Resource" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
] as const;

export type GanttChartColumnHeaders = typeof GANTT_CHART_COLUMN_HEADERS;

/**
 * GanttChartDataRow represents a single row of data in the Gantt chart.
 * Each row contains information about a task or variant, including its
 * ID, name, assigned resource, start and end dates, duration, completion
 * percentage, and dependencies.
 *
 *
 */
export type GanttChartDataRow = [
  /**
   * A unique identifier for the row.
   */
  id: string,
  /**
   * The name or description of the row (e.g., task or variant name).
   */
  displayName: string,
  /**
   * The resource assigned to the row. Can be null if no resource is assigned.
   */
  resource: string | null,
  /**
   * The date and time when the resource started running.
   */
  startDate: Date,
  /**
   * The date and time when the resource finished running.
   */
  endDate: Date,
  /**
   * The duration of the task in milliseconds. Can be null if the duration should be calculated from startDate and endDate.
   */
  duration: number | null,
  /**
   * The percentage of the task that has been completed, represented as a number between 0 and 100.
   */
  percentComplete: number,
  /**
   * A comma-separated list of IDs that this resource depends on. Can be null if there are no dependencies.
   */
  dependencies: string | null,
];

export type GanttChartData = [GanttChartColumnHeaders, ...GanttChartDataRow[]];
