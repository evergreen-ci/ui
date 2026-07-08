import { size } from "@evg-ui/lib/constants/tokens";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { ToolStateEnum } from "../types";
import { renderableToolLabels } from "./constants";
import { MergedFindings } from "./utils";
import { ToolRenderer } from ".";

export default {
  component: ToolRenderer,
} satisfies CustomMeta<typeof ToolRenderer>;

const sampleFindings: MergedFindings = {
  summary: "Two errors and one warning found during task execution.",
  overallStatus: "failure",
  errors: [
    {
      line: 42,
      severity: "error",
      message: "Null pointer exception",
      evidence: "java.lang.NullPointerException at Foo.bar(Foo.java:42)",
    },
    {
      line: 87,
      severity: "error",
      message: "Memory leak detected",
      evidence: "Unreleased buffer of 2.3MB",
    },
    {
      line: null,
      severity: "warning",
      message: "Slow query detected",
      evidence: "Query took 12.4s to complete",
    },
    {
      line: 120,
      severity: "info",
      message: "Retrying upload",
      evidence: "Transient network error, retry 1 of 3",
    },
  ],
  events: [
    {
      line: 1,
      timestamp: "2026-04-22T14:01:10Z",
      description: "Task started",
    },
    {
      line: 42,
      timestamp: "2026-04-22T14:02:42Z",
      description: "First error encountered",
    },
    {
      line: null,
      timestamp: null,
      description: "Task aborted",
    },
  ],
  metrics: [
    { name: "Duration", value: "3m 12s" },
    { name: "Memory peak", value: "512MB" },
    { name: "Exit code", value: "1" },
  ],
  observations: [
    "Network latency was elevated throughout the run.",
    "Two distinct crash signatures were observed.",
  ],
};

export const Default = {
  argTypes: {
    type: {
      control: { type: "select" },
      options: Object.keys(renderableToolLabels),
    },
    state: {
      control: { type: "select" },
      options: Object.values(ToolStateEnum),
      type: "string",
    },
  },
  args: {
    type: "tool-askEvergreenAgentTool",
    state: "output-available",
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AllTools = {
  argTypes: {
    state: {
      control: { type: "select" },
      options: Object.values(ToolStateEnum),
      type: "string",
    },
  },
  render: (args) => (
    <>
      {Object.keys(renderableToolLabels).map((tool) => (
        <div key={tool} style={{ padding: `${size.xs} 0` }}>
          <ToolRenderer {...args} type={tool as `tool-${string}`} />
        </div>
      ))}
    </>
  ),
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerProgress = {
  args: {
    type: "tool-logAnalyzerTool",
    toolCallId: "call_example",
    state: ToolStateEnum.InputAvailable,
    input: "analyze logs",
    progress: { percentage: 50, phase: "Refining chunk 3 of 5" },
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerCompleted = {
  args: {
    type: "tool-logAnalyzerTool",
    toolCallId: "call_example",
    state: ToolStateEnum.OutputAvailable,
    input: "analyze logs",
    output: sampleFindings,
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerSuccess = {
  args: {
    type: "tool-logAnalyzerTool",
    toolCallId: "call_example",
    state: ToolStateEnum.OutputAvailable,
    input: "analyze logs",
    output: {
      summary: "Task completed successfully with no errors.",
      overallStatus: "success",
      errors: [],
      events: [
        {
          line: 1,
          timestamp: "2026-04-22T14:01:10Z",
          description: "Task started",
        },
        {
          line: 5000,
          timestamp: "2026-04-22T14:05:02Z",
          description: "Task succeeded",
        },
      ],
      metrics: [
        { name: "Duration", value: "4m 52s" },
        { name: "Exit code", value: "0" },
      ],
      observations: ["No anomalies detected."],
    } satisfies MergedFindings,
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;
