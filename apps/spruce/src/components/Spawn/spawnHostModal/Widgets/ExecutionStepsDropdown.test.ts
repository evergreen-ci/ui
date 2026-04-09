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
      makeStep({ blockType: "post", stepNumber: "3", displayName: "cleanup" }),
      makeStep({
        blockType: "pre",
        stepNumber: "1",
        displayName: "setup env",
      }),
      makeStep({
        blockType: "main",
        stepNumber: "2",
        displayName: "run tests",
      }),
    ];

    const result = groupExecutionSteps(steps);

    expect(result).toStrictEqual([
      {
        label: "BLOCK 'PRE'",
        steps: [{ stepNumber: "1", displayText: "setup env" }],
      },
      {
        label: "BLOCK 'MAIN'",
        steps: [{ stepNumber: "2", displayText: "run tests" }],
      },
      {
        label: "BLOCK 'POST'",
        steps: [{ stepNumber: "3", displayText: "cleanup" }],
      },
    ]);
  });

  it("groups consecutive function steps into their own group and strips context from display names", () => {
    const steps = [
      makeStep({
        blockType: "main",
        stepNumber: "1",
        displayName: "compile in function 'build' in block 'main'",
        functionName: "build",
        isFunction: true,
      }),
      makeStep({
        blockType: "main",
        stepNumber: "2",
        displayName: "link in function 'build' in block 'main'",
        functionName: "build",
        isFunction: true,
      }),
      makeStep({
        blockType: "main",
        stepNumber: "3",
        displayName: "run tests in block 'main'",
      }),
    ];

    const result = groupExecutionSteps(steps);

    expect(result).toStrictEqual([
      {
        label: "BLOCK 'MAIN' — FUNCTION: BUILD",
        steps: [
          { stepNumber: "1", displayText: "compile" },
          { stepNumber: "2", displayText: "link" },
        ],
      },
      {
        label: "BLOCK 'MAIN'",
        steps: [{ stepNumber: "3", displayText: "run tests" }],
      },
    ]);
  });

  it("returns an empty array when given no steps", () => {
    expect(groupExecutionSteps([])).toStrictEqual([]);
  });
});
