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
  errors: [
    {
      evidence: "java.lang.NullPointerException at Foo.bar(Foo.java:42)",
      line: 42,
      message: "Null pointer exception",
      severity: "error",
    },
    {
      evidence: "Unreleased buffer of 2.3MB",
      line: 87,
      message: "Memory leak detected",
      severity: "error",
    },
    {
      evidence: "Query took 12.4s to complete",
      line: null,
      message: "Slow query detected",
      severity: "warning",
    },
    {
      evidence: "Transient network error, retry 1 of 3",
      line: 120,
      message: "Retrying upload",
      severity: "info",
    },
  ],
  events: [
    {
      description: "Task started",
      line: 1,
      timestamp: "2026-04-22T14:01:10Z",
    },
    {
      description: "First error encountered",
      line: 42,
      timestamp: "2026-04-22T14:02:42Z",
    },
    {
      description: "Task aborted",
      line: null,
      timestamp: null,
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
  overallStatus: "failure",
  summary: "Two errors and one warning found during task execution.",
};

export const Default = {
  args: {
    state: "output-available",
    type: "tool-askEvergreenAgentTool",
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: Object.values(ToolStateEnum),
      type: "string",
    },
    type: {
      control: { type: "select" },
      options: Object.keys(renderableToolLabels),
    },
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
    input: "analyze logs",
    progress: { percentage: 50, phase: "Refining chunk 3 of 5" },
    state: ToolStateEnum.InputAvailable,
    toolCallId: "call_example",
    type: "tool-logAnalyzerTool",
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerCompleted = {
  args: {
    input: "analyze logs",
    output: sampleFindings,
    state: ToolStateEnum.OutputAvailable,
    toolCallId: "call_example",
    type: "tool-logAnalyzerTool",
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;

export const AnalyzerSuccess = {
  args: {
    input: "analyze logs",
    output: {
      errors: [],
      events: [
        {
          description: "Task started",
          line: 1,
          timestamp: "2026-04-22T14:01:10Z",
        },
        {
          description: "Task succeeded",
          line: 5000,
          timestamp: "2026-04-22T14:05:02Z",
        },
      ],
      metrics: [
        { name: "Duration", value: "4m 52s" },
        { name: "Exit code", value: "0" },
      ],
      observations: ["No anomalies detected."],
      overallStatus: "success",
      summary: "Task completed successfully with no errors.",
    } satisfies MergedFindings,
    state: ToolStateEnum.OutputAvailable,
    toolCallId: "call_example",
    type: "tool-logAnalyzerTool",
  },
} satisfies CustomStoryObj<typeof ToolRenderer>;
