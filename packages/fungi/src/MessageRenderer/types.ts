import { UIMessage } from "@ai-sdk/react";
import { ToolUIPart } from "ai";

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
  messageId?: string;
  originalMessage?: string;
};

export type FungiUIMessage = UIMessage<MessageMetadata>;
