import { UIMessagePart, UIDataTypes, UITools } from "ai";

export type ProgressUpdate = {
  percentage: number;
  phase: string;
};

export type OverallStatus =
  | "success"
  | "failure"
  | "partial_failure"
  | "unknown";
export type FindingSeverity = "error" | "warning" | "info";

export type MergedFindingError = {
  line: number | null;
  severity: FindingSeverity;
  message: string;
  evidence: string;
};

export type MergedFindingEvent = {
  line: number | null;
  timestamp: string | null;
  description: string;
};

export type MergedFindingMetric = {
  name: string;
  value: string;
};

export type MergedFindings = {
  summary: string;
  overallStatus: OverallStatus;
  errors: MergedFindingError[];
  events: MergedFindingEvent[];
  metrics: MergedFindingMetric[];
  observations: string[];
};

const isFindingSeverity = (value: unknown): value is FindingSeverity =>
  value === "error" || value === "warning" || value === "info";

const isOverallStatus = (value: unknown): value is OverallStatus =>
  value === "success" ||
  value === "failure" ||
  value === "partial_failure" ||
  value === "unknown";

const isMergedFindingError = (value: unknown): value is MergedFindingError => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.line === null || typeof v.line === "number") &&
    isFindingSeverity(v.severity) &&
    typeof v.message === "string" &&
    typeof v.evidence === "string"
  );
};

const isMergedFindingEvent = (value: unknown): value is MergedFindingEvent => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.line === null || typeof v.line === "number") &&
    (v.timestamp === null || typeof v.timestamp === "string") &&
    typeof v.description === "string"
  );
};

const isMergedFindingMetric = (
  value: unknown,
): value is MergedFindingMetric => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.value === "string";
};

export const isMergedFindings = (output: unknown): output is MergedFindings => {
  if (typeof output !== "object" || output === null) return false;
  const v = output as Record<string, unknown>;
  return (
    typeof v.summary === "string" &&
    isOverallStatus(v.overallStatus) &&
    Array.isArray(v.errors) &&
    v.errors.every(isMergedFindingError) &&
    Array.isArray(v.events) &&
    v.events.every(isMergedFindingEvent) &&
    Array.isArray(v.metrics) &&
    v.metrics.every(isMergedFindingMetric) &&
    Array.isArray(v.observations) &&
    v.observations.every((o) => typeof o === "string")
  );
};

type DataProgressData = ProgressUpdate & { toolCallId: string };

const isDataProgressData = (data: unknown): data is DataProgressData =>
  typeof data === "object" &&
  data !== null &&
  typeof (data as Record<string, unknown>).toolCallId === "string" &&
  typeof (data as Record<string, unknown>).percentage === "number" &&
  typeof (data as Record<string, unknown>).phase === "string";

/**
 * Scans a message parts array for `data-tool-progress` entries and returns
 * a map of toolCallId to the latest ProgressUpdate for that tool call.
 * @param parts - The message parts array from a UIMessage.
 * @returns A map of toolCallId to the latest ProgressUpdate.
 */
export const getProgressByToolCallId = (
  parts: Array<UIMessagePart<UIDataTypes, UITools>>,
): Map<string, ProgressUpdate> => {
  const map = new Map<string, ProgressUpdate>();
  for (const part of parts) {
    if (part.type === "data-tool-progress") {
      const { data } = part as { data: unknown };
      if (isDataProgressData(data)) {
        map.set(data.toolCallId, {
          percentage: data.percentage,
          phase: data.phase,
        });
      }
    }
  }
  return map;
};

/**
 * Groups errors by severity for summary displays. The returned object preserves
 * insertion order within each severity so the UI can list them in arrival order.
 * @param errors - The flat list of errors to bucket.
 * @returns An object keyed by severity with the matching errors in original order.
 */
export const groupErrorsBySeverity = (
  errors: MergedFindingError[],
): Record<FindingSeverity, MergedFindingError[]> => {
  const groups: Record<FindingSeverity, MergedFindingError[]> = {
    error: [],
    warning: [],
    info: [],
  };
  for (const e of errors) {
    groups[e.severity].push(e);
  }
  return groups;
};
