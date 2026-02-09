import { UIMessage } from "@ai-sdk/react";
import { ToolUIPart } from "ai";
import { ContextChip } from "#Context";

export type ToolState = ToolUIPart["state"];

const satisfiesToolStates = <T extends Record<string, ToolState>>(t: T) => t;

export const ToolStateEnum = satisfiesToolStates({
  OutputError: "output-error",
  InputStreaming: "input-streaming",
  InputAvailable: "input-available",
  OutputAvailable: "output-available",
} as const);

type MessageMetadata = {
  spanId?: string;
  originalMessage?: string;
  chips: ContextChip[];
};

export type FungiUIMessage = UIMessage<MessageMetadata>;
