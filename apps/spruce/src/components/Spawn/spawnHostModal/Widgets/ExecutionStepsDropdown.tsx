import { useMemo } from "react";
import {
  Combobox,
  ComboboxGroup,
  ComboboxOption,
} from "@leafygreen-ui/combobox";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { SpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import { SpawnTaskQuery } from "gql/generated/types";

type TaskExecutionStep = NonNullable<
  NonNullable<SpawnTaskQuery["task"]>["executionSteps"]
>[number];

interface ExecutionStepsDropdownProps extends SpruceWidgetProps {
  options: SpruceWidgetProps["options"] & {
    executionSteps: TaskExecutionStep[];
  };
}

export const ExecutionStepsDropdown: React.FC<ExecutionStepsDropdownProps> = ({
  label,
  onChange,
  options,
  value,
}) => {
  const { "data-cy": dataCy, elementWrapperCSS, executionSteps } = options;

  const groupedSteps = useMemo(
    () => groupExecutionSteps(executionSteps ?? []),
    [executionSteps],
  );

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <Combobox
        clearable
        data-cy={dataCy}
        label={label}
        onChange={(v: string | null) => onChange(v ?? "")}
        placeholder="Select spawn end point"
        value={value || ""}
      >
        {groupedSteps.map((item) =>
          item.type === "group" ? (
            <ComboboxGroup key={item.label} label={item.label}>
              {item.steps.map((step) => (
                <ComboboxOption
                  key={step.stepNumber}
                  displayName={step.displayText}
                  value={step.stepNumber}
                />
              ))}
            </ComboboxGroup>
          ) : (
            <ComboboxOption
              key={item.step.stepNumber}
              displayName={item.step.displayText}
              value={item.step.stepNumber}
            />
          ),
        )}
      </Combobox>
    </ElementWrapper>
  );
};

interface StepDisplay {
  stepNumber: string;
  displayText: string;
}

type GroupedItem =
  | { type: "group"; label: string; steps: StepDisplay[] }
  | { type: "standalone"; step: StepDisplay };

const stripFunctionContext = (name: string): string =>
  name.replace(/ in function '[^']*'/, "");

const stripBlockContext = (name: string): string =>
  name.replace(/ in block '[^']*'/, "");

export const groupExecutionSteps = (
  steps: TaskExecutionStep[],
): GroupedItem[] => {
  const mainSteps: TaskExecutionStep[] = [];
  const blockSteps: Record<string, TaskExecutionStep[]> = {};

  for (const step of steps) {
    if (step.blockType) {
      if (!blockSteps[step.blockType]) {
        blockSteps[step.blockType] = [];
      }
      blockSteps[step.blockType].push(step);
    } else {
      mainSteps.push(step);
    }
  }

  const result: GroupedItem[] = [];

  result.push(...groupByFunction(mainSteps, false));

  const seenBlocks = new Set<string>();
  for (const step of steps) {
    if (step.blockType && !seenBlocks.has(step.blockType)) {
      seenBlocks.add(step.blockType);
      const blockLabel = `BLOCK '${step.blockType.toUpperCase()}'`;
      const innerItems = groupByFunction(blockSteps[step.blockType], true);

      const allStepsInBlock: StepDisplay[] = [];
      for (const item of innerItems) {
        if (item.type === "group") {
          allStepsInBlock.push(...item.steps);
        } else {
          allStepsInBlock.push(item.step);
        }
      }
      result.push({
        type: "group",
        label: blockLabel,
        steps: allStepsInBlock,
      });
    }
  }

  return result;
};

const groupByFunction = (
  steps: TaskExecutionStep[],
  isInsideBlock: boolean,
): GroupedItem[] => {
  const result: GroupedItem[] = [];
  let idx = 0;

  while (idx < steps.length) {
    const { isFunction } = steps[idx];

    if (isFunction) {
      const { functionName } = steps[idx];
      const functionSteps: TaskExecutionStep[] = [];
      while (
        idx < steps.length &&
        steps[idx].isFunction &&
        steps[idx].functionName === functionName
      ) {
        functionSteps.push(steps[idx]);
        idx += 1;
      }

      const label = `FUNCTION: ${functionName.toUpperCase()}`;
      result.push({
        type: "group",
        label,
        steps: functionSteps.map((s) => ({
          stepNumber: s.stepNumber,
          displayText: stripFunctionContext(
            isInsideBlock ? stripBlockContext(s.displayName) : s.displayName,
          ),
        })),
      });
    } else {
      result.push({
        type: "standalone",
        step: {
          stepNumber: steps[idx].stepNumber,
          displayText: isInsideBlock
            ? stripBlockContext(steps[idx].displayName)
            : steps[idx].displayName,
        },
      });
      idx += 1;
    }
  }

  return result;
};
