import { ToolUIPart } from "ai";

export type ToolState = ToolUIPart["state"];

const satisfiesToolStates = <T extends Record<string, ToolState>>(t: T) => t;

export const ToolStateEnum = satisfiesToolStates({
  OutputError: "output-error",
  InputStreaming: "input-streaming",
  InputAvailable: "input-available",
  OutputAvailable: "output-available",
} as const);
