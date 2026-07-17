import { UIDataTypes, UIMessagePart, UITools } from "ai";
import {
  getProgressByToolCallId,
  groupFindingsBySeverity,
  isMergedFindings,
  MergedFindings,
} from "./utils";

type Part = UIMessagePart<UIDataTypes, UITools>;

const makeProgressPart = (
  toolCallId: string,
  percentage: number,
  phase: string,
): Part =>
  ({
    data: { percentage, phase, toolCallId },
    type: "data-tool-progress",
  }) as unknown as Part;

const validFindings: MergedFindings = {
  errors: [],
  events: [],
  metrics: [],
  observations: [],
  overallStatus: "success",
  summary: "ok",
};

describe("getProgressByToolCallId", () => {
  it("returns an empty map when there are no data-tool-progress parts", () => {
    const parts: Part[] = [
      { state: "done", text: "hello", type: "text" } as unknown as Part,
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
      { state: "done", text: "hello", type: "text" } as unknown as Part,
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
        data: { percentage: 50, phase: "Loading" },
        type: "data-tool-progress",
      } as unknown as Part,
      {
        data: { phase: "Loading", toolCallId: "call_1" },
        type: "data-tool-progress",
      } as unknown as Part,
      {
        data: { percentage: 50, toolCallId: "call_1" },
        type: "data-tool-progress",
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
        errors: [
          {
            evidence: "stack trace",
            line: 42,
            message: "NPE",
            severity: "error",
          },
          {
            evidence: null,
            line: null,
            message: "slow",
            severity: "warning",
          },
        ],
        events: [
          { description: "start", line: 1, timestamp: "2026-04-22T14:00:00Z" },
          { description: "aborted", line: null, timestamp: null },
        ],
        metrics: [{ name: "Duration", value: "3m" }],
        observations: ["noisy network"],
        overallStatus: "partial_failure",
        summary: "found issues",
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
          { evidence: "e", line: "forty-two", message: "m", severity: "error" },
        ],
      }),
    ).toBe(false);
    expect(
      isMergedFindings({
        ...validFindings,
        errors: [
          { evidence: "e", line: 1, message: "m", severity: "critical" },
        ],
      }),
    ).toBe(false);
  });

  it("returns false when events items are malformed", () => {
    expect(
      isMergedFindings({
        ...validFindings,
        events: [{ description: "x", line: 1, timestamp: 123 }],
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

describe("groupFindingsBySeverity", () => {
  it("groups findings into error/warning/info buckets preserving order", () => {
    const w1 = {
      evidence: "",
      line: 1,
      message: "w1",
      severity: "warning",
    } as const;
    const e1 = {
      evidence: "",
      line: 2,
      message: "e1",
      severity: "error",
    } as const;
    const i1 = {
      evidence: "",
      line: 3,
      message: "i1",
      severity: "info",
    } as const;
    const e2 = {
      evidence: "",
      line: 4,
      message: "e2",
      severity: "error",
    } as const;
    expect(groupFindingsBySeverity([w1, e1, i1, e2])).toEqual({
      error: [e1, e2],
      info: [i1],
      warning: [w1],
    });
  });

  it("returns empty arrays for each severity when given no findings", () => {
    expect(groupFindingsBySeverity([])).toEqual({
      error: [],
      info: [],
      warning: [],
    });
  });
});
