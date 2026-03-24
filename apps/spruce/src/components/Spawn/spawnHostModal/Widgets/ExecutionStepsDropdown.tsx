import { useMemo } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
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
    failingStepNumber?: string;
    isFailedTask?: boolean;
  };
}

export const ExecutionStepsDropdown: React.FC<ExecutionStepsDropdownProps> = ({
  label,
  onChange,
  options,
  value,
}) => {
  const {
    "data-cy": dataCy,
    elementWrapperCSS,
    executionSteps,
    failingStepNumber,
    isFailedTask,
  } = options;

  const groupedSteps = useMemo(
    () => groupExecutionSteps(executionSteps ?? []),
    [executionSteps],
  );

  const showFailingCheckbox = isFailedTask && failingStepNumber;
  const isChecked = value === failingStepNumber;

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
        {groupedSteps.map((item) => (
          <ComboboxGroup key={item.label} label={item.label}>
            {item.items.map((blockItem) => {
              if (blockItem.type === "function-label") {
                return (
                  <ComboboxOption
                    key={`label-${blockItem.label}`}
                    disabled
                    displayName={`  ${blockItem.label}`}
                    value=""
                  />
                );
              }
              const indent = blockItem.inFunction ? "    " : "";
              return (
                <ComboboxOption
                  key={blockItem.stepNumber}
                  displayName={`${indent}${blockItem.displayText}`}
                  value={blockItem.stepNumber}
                />
              );
            })}
          </ComboboxGroup>
        ))}
      </Combobox>
      {showFailingCheckbox && (
        <Checkbox
          checked={isChecked}
          data-cy="default-to-failing-task-checkbox"
          label="Default to Failing Task"
          onChange={(e) => onChange(e.target.checked ? failingStepNumber : "")}
        />
      )}
    </ElementWrapper>
  );
};

type BlockItem =
  | { type: "function-label"; label: string }
  | {
      type: "option";
      stepNumber: string;
      displayText: string;
      inFunction: boolean;
    };

type GroupedItem = { type: "block-group"; label: string; items: BlockItem[] };

const stripFunctionContext = (name: string): string =>
  name.replace(/ in function '[^']*'/, "");

const stripBlockContext = (name: string): string =>
  name.replace(/ in block '[^']*'/, "");

export const groupExecutionSteps = (
  steps: TaskExecutionStep[],
): GroupedItem[] => {
  // Separate steps by block type
  const blockSteps: Record<string, TaskExecutionStep[]> = {};

  for (const step of steps) {
    const blockKey = step.blockType || "main";
    if (!blockSteps[blockKey]) {
      blockSteps[blockKey] = [];
    }
    blockSteps[blockKey].push(step);
  }

  const result: GroupedItem[] = [];

  // Process blocks in fixed order: pre → main → post/timeout
  const blockOrder = ["pre", "main", "post", "timeout"];

  for (const blockKey of blockOrder) {
    const stepsInBlock = blockSteps[blockKey];
    if (!stepsInBlock || stepsInBlock.length === 0) continue;

    const blockLabel = `BLOCK '${blockKey.toUpperCase()}'`;
    const blockItems: BlockItem[] = [];

    let idx = 0;
    while (idx < stepsInBlock.length) {
      const step = stepsInBlock[idx];

      if (step.isFunction) {
        const { functionName } = step;
        const functionSteps: TaskExecutionStep[] = [];

        while (
          idx < stepsInBlock.length &&
          stepsInBlock[idx].isFunction &&
          stepsInBlock[idx].functionName === functionName
        ) {
          functionSteps.push(stepsInBlock[idx]);
          idx += 1;
        }

        blockItems.push({
          type: "function-label",
          label: `FUNCTION: ${functionName.toUpperCase()}`,
        });

        for (const funcStep of functionSteps) {
          blockItems.push({
            type: "option",
            stepNumber: funcStep.stepNumber,
            displayText: stripFunctionContext(
              stripBlockContext(funcStep.displayName),
            ),
            inFunction: true,
          });
        }
      } else {
        // Standalone step in block
        blockItems.push({
          type: "option",
          stepNumber: step.stepNumber,
          displayText: stripBlockContext(step.displayName),
          inFunction: false,
        });
        idx += 1;
      }
    }

    result.push({
      type: "block-group",
      label: blockLabel,
      items: blockItems,
    });
  }

  for (const [blockKey, stepsInBlock] of Object.entries(blockSteps)) {
    if (!blockOrder.includes(blockKey) && stepsInBlock.length > 0) {
      const blockLabel = `BLOCK '${blockKey.toUpperCase()}'`;
      const blockItems: BlockItem[] = [];

      let idx = 0;
      while (idx < stepsInBlock.length) {
        const step = stepsInBlock[idx];

        if (step.isFunction) {
          const { functionName } = step;
          const functionSteps: TaskExecutionStep[] = [];

          while (
            idx < stepsInBlock.length &&
            stepsInBlock[idx].isFunction &&
            stepsInBlock[idx].functionName === functionName
          ) {
            functionSteps.push(stepsInBlock[idx]);
            idx += 1;
          }

          blockItems.push({
            type: "function-label",
            label: `FUNCTION: ${functionName.toUpperCase()}`,
          });

          for (const funcStep of functionSteps) {
            blockItems.push({
              type: "option",
              stepNumber: funcStep.stepNumber,
              displayText: stripFunctionContext(
                stripBlockContext(funcStep.displayName),
              ),
              inFunction: true,
            });
          }
        } else {
          blockItems.push({
            type: "option",
            stepNumber: step.stepNumber,
            displayText: stripBlockContext(step.displayName),
            inFunction: false,
          });
          idx += 1;
        }
      }

      result.push({
        type: "block-group",
        label: blockLabel,
        items: blockItems,
      });
    }
  }

  return result;
};
