import { UIMessagePart, UIDataTypes, UITools } from "ai";
import {
  MergedFindings,
  getProgressByToolCallId,
  groupErrorsBySeverity,
  isMergedFindings,
} from "./utils";

type Part = UIMessagePart<UIDataTypes, UITools>;

const makeProgressPart = (
  toolCallId: string,
  percentage: number,
  phase: string,
): Part =>
  ({
    type: "data-tool-progress",
    data: { toolCallId, percentage, phase },
  }) as unknown as Part;

const validFindings: MergedFindings = {
  summary: "ok",
  overallStatus: "success",
  errors: [],
  events: [],
  metrics: [],
  observations: [],
};

describe("getProgressByToolCallId", () => {
  it("returns an empty map when there are no data-tool-progress parts", () => {
    const parts: Part[] = [
      { type: "text", text: "hello", state: "done" } as unknown as Part,
    ];
    expect(getProgressByToolCallId(parts).size).toBe(0);
  });

  it("returns an empty map for an empty parts array", () => {
    expect(getProgressByToolCallId([]).size).toBe(0);
  });

  it("extracts a single progress entry", () => {
    const parts: Part[] = [makeProgressPart("call_1", 20, "Chunking complete")];
    const map = getProgressByToolCallId(parts);
    expect(map.get("call_1")).toEqual({
      percentage: 20,
      phase: "Chunking complete",
    });
  });

  it("keeps only the latest progress per tool call", () => {
    const parts: Part[] = [
      makeProgressPart("call_1", 0, "Loading data"),
      makeProgressPart("call_1", 10, "Data loaded"),
      makeProgressPart("call_1", 20, "Chunking complete"),
    ];
    const map = getProgressByToolCallId(parts);
    expect(map.size).toBe(1);
    expect(map.get("call_1")).toEqual({
      percentage: 20,
      phase: "Chunking complete",
    });
  });

  it("tracks progress independently for multiple tool calls", () => {
    const parts: Part[] = [
      makeProgressPart("call_1", 10, "Data loaded"),
      makeProgressPart("call_2", 50, "Refining chunk 3 of 5"),
      makeProgressPart("call_1", 20, "Chunking complete"),
    ];
    const map = getProgressByToolCallId(parts);
    expect(map.size).toBe(2);
    expect(map.get("call_1")).toEqual({
      percentage: 20,
      phase: "Chunking complete",
    });
    expect(map.get("call_2")).toEqual({
      percentage: 50,
      phase: "Refining chunk 3 of 5",
    });
  });

  it("ignores parts that are not data-tool-progress", () => {
    const parts: Part[] = [
      { type: "text", text: "hello", state: "done" } as unknown as Part,
      { type: "step-start" } as unknown as Part,
      makeProgressPart("call_1", 80, "Generating final report"),
    ];
    const map = getProgressByToolCallId(parts);
    expect(map.size).toBe(1);
    expect(map.get("call_1")).toEqual({
      percentage: 80,
      phase: "Generating final report",
    });
  });

  it("skips data-tool-progress parts with missing required fields", () => {
    const parts: Part[] = [
      {
        type: "data-tool-progress",
        data: { percentage: 50, phase: "Loading" },
      } as unknown as Part,
      {
        type: "data-tool-progress",
        data: { toolCallId: "call_1", phase: "Loading" },
      } as unknown as Part,
      {
        type: "data-tool-progress",
        data: { toolCallId: "call_1", percentage: 50 },
      } as unknown as Part,
    ];
    expect(getProgressByToolCallId(parts).size).toBe(0);
  });
});

describe("isMergedFindings", () => {
  it("returns true for a minimally valid MergedFindings object", () => {
    expect(isMergedFindings(validFindings)).toBe(true);
  });

  it("returns true with populated errors, events, metrics, observations", () => {
    expect(
      isMergedFindings({
        summary: "found issues",
        overallStatus: "partial_failure",
        errors: [
          {
            line: 42,
            severity: "error",
            message: "NPE",
            evidence: "stack trace",
          },
          {
            line: null,
            severity: "warning",
            message: "slow",
            evidence: null,
          },
        ],
        events: [
          { line: 1, timestamp: "2026-04-22T14:00:00Z", description: "start" },
          { line: null, timestamp: null, description: "aborted" },
        ],
        metrics: [{ name: "Duration", value: "3m" }],
        observations: ["noisy network"],
      }),
    ).toBe(true);
  });

  it("returns false for null or non-object", () => {
    expect(isMergedFindings(null)).toBe(false);
    expect(isMergedFindings("string")).toBe(false);
    expect(isMergedFindings(42)).toBe(false);
  });

  it("returns false when summary is missing or not a string", () => {
    expect(isMergedFindings({ ...validFindings, summary: undefined })).toBe(
      false,
    );
    expect(isMergedFindings({ ...validFindings, summary: 1 })).toBe(false);
  });

  it("returns false for unknown overallStatus values", () => {
    expect(isMergedFindings({ ...validFindings, overallStatus: "bogus" })).toBe(
      false,
    );
  });

  it("returns false when errors is not an array or has invalid items", () => {
    expect(isMergedFindings({ ...validFindings, errors: "bad" })).toBe(false);
    expect(
      isMergedFindings({
        ...validFindings,
        errors: [
          { line: "forty-two", severity: "error", message: "m", evidence: "e" },
        ],
      }),
    ).toBe(false);
    expect(
      isMergedFindings({
        ...validFindings,
        errors: [
          { line: 1, severity: "critical", message: "m", evidence: "e" },
        ],
      }),
    ).toBe(false);
  });

  it("returns false when events items are malformed", () => {
    expect(
      isMergedFindings({
        ...validFindings,
        events: [{ line: 1, timestamp: 123, description: "x" }],
      }),
    ).toBe(false);
  });

  it("returns false when metrics items are malformed", () => {
    expect(
      isMergedFindings({
        ...validFindings,
        metrics: [{ name: "Duration", value: 3 }],
      }),
    ).toBe(false);
  });

  it("returns false when observations contains non-strings", () => {
    expect(
      isMergedFindings({ ...validFindings, observations: ["ok", 42] }),
    ).toBe(false);
  });
});

describe("groupErrorsBySeverity", () => {
  it("groups errors into error/warning/info buckets preserving order", () => {
    const w1 = {
      line: 1,
      severity: "warning",
      message: "w1",
      evidence: "",
    } as const;
    const e1 = {
      line: 2,
      severity: "error",
      message: "e1",
      evidence: "",
    } as const;
    const i1 = {
      line: 3,
      severity: "info",
      message: "i1",
      evidence: "",
    } as const;
    const e2 = {
      line: 4,
      severity: "error",
      message: "e2",
      evidence: "",
    } as const;
    expect(groupErrorsBySeverity([w1, e1, i1, e2])).toEqual({
      error: [e1, e2],
      warning: [w1],
      info: [i1],
    });
  });

  it("returns empty arrays for each severity when given no errors", () => {
    expect(groupErrorsBySeverity([])).toEqual({
      error: [],
      warning: [],
      info: [],
    });
  });
});
