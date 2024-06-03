import { SectionEntry, processLine, reduceFn } from "./utils";

describe("processLine", () => {
  it("should correctly parse a log line indicating a running section", () => {
    const logLine =
      "Running command 'ec2.assume_role' in function 'assume-ec2-role' (step 1 of 4) in block 'pre'.";
    const expectedMetadata = {
      functionName: "assume-ec2-role",
      status: "Running",
    };
    expect(processLine(logLine)).toEqual(expectedMetadata);
  });

  it("should correctly parse a log line indicating a finished section", () => {
    const logLine =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9) in 415.963µs.";
    const expectedMetadata = {
      functionName: "yarn-preview",
      status: "Finished",
    };
    expect(processLine(logLine)).toEqual(expectedMetadata);
  });

  it("should return null for a log line that does not indicate a section", () => {
    const logLine = "This is a regular log line.";
    expect(processLine(logLine)).toBeNull();
  });
});

describe("reduceFn", () => {
  it("accumulate section data for starting a section", () => {
    const accum = [] as SectionEntry[];
    const line = "Running command 'shell.exec' in function 'yarn-preview'.";
    const logIndex = 0;
    const expectedSections = [
      {
        functionName: "yarn-preview",
        range: { end: -1, start: 0 },
      },
    ];
    expect(reduceFn(accum, line, logIndex)).toEqual(expectedSections);
  });
  it("accumulate section data for finishing a section", () => {
    const accum = [
      { functionName: "yarn-preview", range: { end: -1, start: 0 } },
    ] as SectionEntry[];
    const line =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9) in 415.963µs.";
    const logIndex = 4;
    const expectedSections = [
      {
        functionName: "yarn-preview",
        range: { end: 5, start: 0 },
      },
    ];
    expect(reduceFn(accum, line, logIndex)).toEqual(expectedSections);
  });

  it("should throw an error if a finished section appears before a running section", () => {
    const accum = [] as SectionEntry[];
    const line =
      "Finished command 'shell.exec' in function 'yarn-preview' (step 6 of 9) in 415.963µs.";
    const logIndex = 0;
    expect(() => reduceFn(accum, line, logIndex)).toThrow(
      Error(
        "Log file is showing a finished section without a running section before it. This should not happen.",
      ),
    );
  });

  it("should throw an error if a new running section starts without finishing the previous section", () => {
    const accum = [
      { functionName: "yarn-preview", range: { end: -1, start: 0 } },
    ];
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
