import { initialSectionState, sectionData } from "./testData";
import {
  SectionData,
  getSectionStateWithOpenSectionBasedOnLineNumber,
  parseSections,
  populateSectionState,
  processLine,
  reduceFn,
} from "./utils";

describe("processLine", () => {
  it("should correctly parse a log line indicating a running section", () => {
    const logLine =
      "Running command 'ec2.assume_role' in function 'assume-ec2-role' (step 1.3 of 4) in block 'pre'.";
    const expectedMetadata = {
      commandName: "ec2.assume_role",
      functionName: "assume-ec2-role",
      status: "Running",
      step: "1.3 of 4",
    };
    expect(processLine(logLine)).toStrictEqual(expectedMetadata);
  });

  it("should correctly parse a log line indicating a finished section", () => {
    const logLine =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9.9) in 415.963µs.";
    const expectedMetadata = {
      commandName: "shell.exec",
      functionName: "yarn-preview",
      status: "Finished",
      step: "6 of 9.9",
    };
    expect(processLine(logLine)).toStrictEqual(expectedMetadata);
  });

  it("should return null for a log line that does not indicate a section", () => {
    const logLine = "This is a regular log line.";
    expect(processLine(logLine)).toBeNull();
  });
});

describe("reduceFn", () => {
  it("accumulate section data for starting a section", () => {
    const accum: SectionData = { commands: [], functions: [] };
    const line =
      "Running command 'shell.exec' in function 'yarn-preview' (step 6 of 9).";
    const logIndex = 0;
    expect(reduceFn(accum, line, logIndex)).toEqual({
      commands: [
        {
          commandID: "command-0",
          commandName: "shell.exec",
          functionID: "function-0",
          range: { end: -1, start: 0 },
          step: "6 of 9",
        },
      ],
      functions: [
        {
          functionID: "function-0",
          functionName: "yarn-preview",
          range: { end: -1, start: 0 },
        },
      ],
    });
  });
  it("accumulate section data for finishing a section", () => {
    const accum: SectionData = {
      commands: [
        {
          commandID: "command-0",
          commandName: "shell.exec",
          functionID: "function-0",
          range: { end: -1, start: 0 },
          step: "6 of 9",
        },
      ],
      functions: [
        {
          functionID: "function-0",
          functionName: "yarn-preview",
          range: { end: -1, start: 0 },
        },
      ],
    };
    const line =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9) in 415.963µs.";
    const logIndex = 4;
    expect(reduceFn(accum, line, logIndex)).toEqual({
      commands: [
        {
          commandID: "command-0",
          commandName: "shell.exec",
          functionID: "function-0",
          range: {
            end: 5,
            start: 0,
          },
          step: "6 of 9",
        },
      ],
      functions: [
        {
          functionID: "function-0",
          functionName: "yarn-preview",
          range: {
            end: 5,
            start: 0,
          },
        },
      ],
    });
  });

  it("should throw an error if a finished section appears before a running section", () => {
    const accum: SectionData = { commands: [], functions: [] };
    const line =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9) in 415.963µs.";
    const logIndex = 0;
    expect(() => reduceFn(accum, line, logIndex)).toThrow(
      Error(
        "Log file is showing a finished section without a running section before it.",
      ),
    );
  });

  it("should throw an error if a new running section starts without finishing the previous section", () => {
    const accum: SectionData = {
      commands: [
        {
          commandID: "command-0",
          commandName: "shell.exec",
          functionID: "function-0",
          range: { end: -1, start: 0 },
          step: "2 of 8",
        },
      ],
      functions: [
        {
          functionID: "function-0",
          functionName: "yarn-preview",
          range: { end: -1, start: 0 },
        },
      ],
    };
    const line =
      "Running command 'attach.xunit_results' in function 'attach-cypress-results' (step 3.3 of 8) in block 'post'.";
    const logIndex = 1;
    expect(() => reduceFn(accum, line, logIndex)).toThrow(
      Error(
        "Log file is showing a new running section without finishing the previous section.",
      ),
    );
  });
});

describe("parseSections", () => {
  it("should correctly extract section data and close the last section when it is still running", () => {
    const logs = [
      "normal log line",
      "Running command 'c1' in function 'f-1' (step 1 of 4).",
      "Finished command 'c1' in function 'f-1' (step 1 of 4).",
      "Running command 'c2' in function 'f-1' (step 1 of 4).",
      "Finished command 'c2' in function 'f-1' (step 1 of 4).",
      "normal log line",
      "Running command 'c3' in function 'f-2' (step 1 of 4).",
      "normal log line",
      "Finished command 'c3' in function 'f-2' (step 1 of 4).",
      "Running command 'c4' in function 'f-2' (step 1 of 4).",
      "Finished command 'c4' in function 'f-2' (step 1 of 4).",
      "Running command 'c5' in function 'f-3' (step 1 of 4).",
      "normal log line",
      "normal log line",
      "normal log line",
    ];
    const step = "1 of 4";
    const expectedSections: SectionData = {
      commands: [
        {
          commandID: "command-1",
          commandName: "c1",
          functionID: "function-1",
          range: {
            end: 3,
            start: 1,
          },
          step,
        },
        {
          commandID: "command-3",
          commandName: "c2",
          functionID: "function-1",
          range: {
            end: 5,
            start: 3,
          },
          step,
        },
        {
          commandID: "command-6",
          commandName: "c3",
          functionID: "function-6",
          range: {
            end: 9,
            start: 6,
          },
          step,
        },
        {
          commandID: "command-9",
          commandName: "c4",
          functionID: "function-6",
          range: {
            end: 11,
            start: 9,
          },
          step,
        },
        {
          commandID: "command-11",
          commandName: "c5",
          functionID: "function-11",
          range: {
            end: 15,
            start: 11,
          },
          step,
        },
      ],
      functions: [
        {
          functionID: "function-1",
          functionName: "f-1",
          range: {
            end: 5,
            start: 1,
          },
        },
        {
          functionID: "function-6",
          functionName: "f-2",
          range: {
            end: 11,
            start: 6,
          },
        },
        {
          functionID: "function-11",
          functionName: "f-3",
          range: {
            end: 15,
            start: 11,
          },
        },
      ],
    };
    expect(parseSections(logs)).toEqual(expectedSections);
  });

  it("should correctly extract section data when all sections are finished", () => {
    const logs = [
      "normal log line",
      "Running command 'c1' in function 'f-1' (step 1 of 4).",
      "normal log line",
      "normal log line",
      "normal log line",
      "Finished command 'c1' in function 'f-1' (step 1 of 4).",
      "Running command 'c2' in function 'f-1' (step 1 of 4).",
      "Finished command 'c2' in function 'f-1' (step 1 of 4).",
      "normal log line",
      "Running command 'c3' in function 'f-2' (step 1 of 4).",
      "normal log line",
      "Finished command 'c3' in function 'f-2' (step 1 of 4).",
      "Running command 'c4' in function 'f-2' (step 1 of 4).",
      "Finished command 'c4' in function 'f-2' (step 1 of 4).",
      "normal log line",
      "normal log line",
      "normal log line",
    ];
    const step = "1 of 4";
    expect(parseSections(logs)).toEqual({
      commands: [
        {
          commandID: "command-1",
          commandName: "c1",
          functionID: "function-1",
          range: {
            end: 6,
            start: 1,
          },
          step,
        },
        {
          commandID: "command-6",
          commandName: "c2",
          functionID: "function-1",
          range: {
            end: 8,
            start: 6,
          },
          step,
        },
        {
          commandID: "command-9",
          commandName: "c3",
          functionID: "function-9",
          range: {
            end: 12,
            start: 9,
          },
          step,
        },
        {
          commandID: "command-12",
          commandName: "c4",
          functionID: "function-9",
          range: {
            end: 14,
            start: 12,
          },
          step,
        },
      ],
      functions: [
        {
          functionID: "function-1",
          functionName: "f-1",
          range: {
            end: 8,
            start: 1,
          },
        },
        {
          functionID: "function-9",
          functionName: "f-2",
          range: {
            end: 14,
            start: 9,
          },
        },
      ],
    });
  });

  it("should return an error when there is a finished section without a running section before it", () => {
    const logs = [
      "Finished command 'c1' in function 'f-1' (step 1 of 4).",
      "Running command 'c2' in function 'f-1' (step 1 of 4).",
      "Finished command 'c2' in function 'f-1' (step 1 of 4).",
    ];
    expect(() => parseSections(logs)).toThrow(
      Error(
        "Log file is showing a finished section without a running section before it.",
      ),
    );
  });

  it("should return an error when there is a new running section without finishing the previous section", () => {
    const logs = [
      "Running command 'c1' in function 'f-1' (step 1 of 4).",
      "Running command 'c2' in function 'f-2' (step 1 of 4).",
    ];
    expect(() => parseSections(logs)).toThrow(
      Error(
        "Log file is showing a new running section without finishing the previous section.",
      ),
    );
  });

  it("should return empty arrays if the logs array is empty", () => {
    const logs: string[] = [];
    expect(parseSections(logs)).toEqual({ commands: [], functions: [] });
  });
});

describe("getSectionStateWithOpenSectionBasedOnLineNumber", () => {
  it("should open the sections containing the line number", () => {
    const result = getSectionStateWithOpenSectionBasedOnLineNumber({
      lineNumbers: [1],
      sectionData,
      sectionState: initialSectionState,
    });
    const nextSectionState = {
      ...initialSectionState,
      "function-1": {
        commands: {
          "command-1": {
            isOpen: true,
          },
          "command-6": {
            isOpen: false,
          },
        },
        isOpen: true,
      },
    };
    expect(result).toStrictEqual([true, nextSectionState]);
  });

  it("should return the given sectionState value and reference when the given line number doesn't belong to a section", () => {
    const result = getSectionStateWithOpenSectionBasedOnLineNumber({
      lineNumbers: [100],
      sectionData,
      sectionState: initialSectionState,
    });
    expect(result).toStrictEqual([false, initialSectionState]);
    expect(result[1]).not.toBe(initialSectionState);
  });

  it("should return the given sectionState value and reference when the given line number's section is already open", () => {
    const sectionState = {
      ...initialSectionState,
      "function-1": {
        commands: {
          "command-1": {
            isOpen: true,
          },
          "command-6": {
            isOpen: false,
          },
        },
        isOpen: true,
      },
    };
    const result = getSectionStateWithOpenSectionBasedOnLineNumber({
      lineNumbers: [1],
      sectionData,
      sectionState,
    });
    expect(result).toStrictEqual([false, sectionState]);
    expect(result[1]).not.toBe(sectionState);
  });
});

describe("populateSectionState", () => {
  it("should populate the section state based on the section data with all sections closed when 'openSectionContainingLine' is undefined", () => {
    const result = populateSectionState(sectionData, undefined);
    expect(result).toStrictEqual(initialSectionState);
  });
  it("should populate the section state based on the section data with all sections closed when 'openSectionContainingLine' does not match a section", () => {
    const result = populateSectionState(sectionData, 999999);
    expect(result).toStrictEqual(initialSectionState);
  });
  it("should populate the section state based on the section data with all sections closed except the sections containing 'openSectionContainingLine'", () => {
    const result = populateSectionState(sectionData, 1);
    expect(result).toStrictEqual({
      ...initialSectionState,
      "function-1": {
        commands: {
          "command-1": {
            isOpen: true,
          },
          "command-6": {
            isOpen: false,
          },
        },
        isOpen: true,
      },
    });
  });
});
