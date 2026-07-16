import { groupExecutionSteps } from "./ExecutionStepsDropdown";

const makeStep = (
  overrides: Partial<{
    blockType: string;
    commandName: string;
    displayName: string;
    functionName: string;
    isFunction: boolean;
    stepNumber: string;
  }>,
) => ({
  blockType: "main",
  commandName: "shell.exec",
  displayName: "run tests",
  functionName: "",
  isFunction: false,
  stepNumber: "1",
  ...overrides,
});

describe("groupExecutionSteps", () => {
  it("groups standalone steps by block and orders blocks correctly", () => {
    const steps = [
      makeStep({ blockType: "post", displayName: "cleanup", stepNumber: "3" }),
      makeStep({
        blockType: "pre",
        displayName: "setup env",
        stepNumber: "1",
      }),
      makeStep({
        blockType: "main",
        displayName: "run tests",
        stepNumber: "2",
      }),
    ];

    const result = groupExecutionSteps(steps);

    expect(result).toStrictEqual([
      {
        label: "BLOCK 'PRE'",
        steps: [{ displayText: "setup env", stepNumber: "1" }],
      },
      {
        label: "BLOCK 'MAIN'",
        steps: [{ displayText: "run tests", stepNumber: "2" }],
      },
      {
        label: "BLOCK 'POST'",
        steps: [{ displayText: "cleanup", stepNumber: "3" }],
      },
    ]);
  });

  it("groups consecutive function steps into their own group and strips context from display names", () => {
    const steps = [
      makeStep({
        blockType: "main",
        displayName: "compile in function 'build' in block 'main'",
        functionName: "build",
        isFunction: true,
        stepNumber: "1",
      }),
      makeStep({
        blockType: "main",
        displayName: "link in function 'build' in block 'main'",
        functionName: "build",
        isFunction: true,
        stepNumber: "2",
      }),
      makeStep({
        blockType: "main",
        displayName: "run tests in block 'main'",
        stepNumber: "3",
      }),
    ];

    const result = groupExecutionSteps(steps);

    expect(result).toStrictEqual([
      {
        label: "BLOCK 'MAIN' — FUNCTION: BUILD",
        steps: [
          { displayText: "compile", stepNumber: "1" },
          { displayText: "link", stepNumber: "2" },
        ],
      },
      {
        label: "BLOCK 'MAIN'",
        steps: [{ displayText: "run tests", stepNumber: "3" }],
      },
    ]);
  });

  it("returns an empty array when given no steps", () => {
    expect(groupExecutionSteps([])).toStrictEqual([]);
  });
});
