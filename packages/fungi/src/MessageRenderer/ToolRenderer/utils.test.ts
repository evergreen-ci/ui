import { UIMessagePart, UIDataTypes, UITools } from "ai";
import { getProgressByToolCallId } from "./utils";

type Part = UIMessagePart<UIDataTypes, UITools>;

const makeProgressPart = (
  toolCallId: string,
  percentage: number,
  phase: string,
): Part =>
  ({
    type: "data-progress",
    data: { toolCallId, percentage, phase },
  }) as unknown as Part;

describe("getProgressByToolCallId", () => {
  it("returns an empty map when there are no data-progress parts", () => {
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

  it("ignores parts that are not data-progress", () => {
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

  it("skips data-progress parts with missing required fields", () => {
    const parts: Part[] = [
      {
        type: "data-progress",
        data: { percentage: 50, phase: "Loading" },
      } as unknown as Part,
      {
        type: "data-progress",
        data: { toolCallId: "call_1", phase: "Loading" },
      } as unknown as Part,
      {
        type: "data-progress",
        data: { toolCallId: "call_1", percentage: 50 },
      } as unknown as Part,
    ];
    expect(getProgressByToolCallId(parts).size).toBe(0);
  });
});
