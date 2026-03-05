import { UIMessagePart, UIDataTypes, UITools } from "ai";

export type ProgressUpdate = {
  percentage: number;
  phase: string;
};

type DataProgressData = ProgressUpdate & { toolCallId: string };

const isDataProgressData = (data: unknown): data is DataProgressData =>
  typeof data === "object" &&
  data !== null &&
  typeof (data as Record<string, unknown>).toolCallId === "string" &&
  typeof (data as Record<string, unknown>).percentage === "number" &&
  typeof (data as Record<string, unknown>).phase === "string";

/**
 * Scans a message parts array for `data-progress` entries and returns
 * a map of toolCallId to the latest ProgressUpdate for that tool call.
 * @param parts - The message parts array from a UIMessage.
 * @returns A map of toolCallId to the latest ProgressUpdate.
 */
export const getProgressByToolCallId = (
  parts: Array<UIMessagePart<UIDataTypes, UITools>>,
): Map<string, ProgressUpdate> => {
  const map = new Map<string, ProgressUpdate>();
  for (const part of parts) {
    if (part.type === "data-progress") {
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
