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
  evidence: string | null;
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
    (v.evidence === null || typeof v.evidence === "string")
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

const isDataProgressData = (data: unknown): data is DataProgressData => {
  if (typeof data !== "object" || data === null) return false;
  const v = data as Record<string, unknown>;
  return (
    typeof v.toolCallId === "string" &&
    typeof v.percentage === "number" &&
    typeof v.phase === "string"
  );
};

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

// Insertion order is preserved within each severity so the UI lists findings
// in the order the analyzer emitted them.
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
