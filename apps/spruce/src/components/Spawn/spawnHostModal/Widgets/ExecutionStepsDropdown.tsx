import { useMemo } from "react";
import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import {
  Combobox,
  ComboboxGroup,
  ComboboxOption,
} from "@leafygreen-ui/combobox";
import { size } from "@evg-ui/lib/constants/tokens";
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

  const groups = useMemo(
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
        {groups.map((group) => (
          <ComboboxGroup key={group.label} label={group.label}>
            {group.steps.map((step) => (
              <ComboboxOption
                key={step.stepNumber}
                displayName={step.displayText}
                value={step.stepNumber}
              />
            ))}
          </ComboboxGroup>
        ))}
      </Combobox>
      {showFailingCheckbox && (
        <StyledCheckbox
          checked={isChecked}
          data-cy="default-to-failing-task-checkbox"
          label="Default to Failing Task"
          onChange={(e) => onChange(e.target.checked ? failingStepNumber : "")}
        />
      )}
    </ElementWrapper>
  );
};

const StyledCheckbox = styled(Checkbox)`
  margin-top: ${size.s};
`;

interface StepOption {
  stepNumber: string;
  displayText: string;
}

interface GroupedSection {
  label: string;
  steps: StepOption[];
}

const stripFunctionContext = (name: string): string =>
  name.replace(/ in function '[^']*'/, "");

const stripBlockContext = (name: string): string =>
  name.replace(/ in block '[^']*'/, "");

export const groupExecutionSteps = (
  steps: TaskExecutionStep[],
): GroupedSection[] => {
  const blockSteps: Record<string, TaskExecutionStep[]> = {};

  for (const step of steps) {
    const blockKey = step.blockType || "main";
    if (!blockSteps[blockKey]) {
      blockSteps[blockKey] = [];
    }
    blockSteps[blockKey].push(step);
  }

  const result: GroupedSection[] = [];

  const blockOrder = ["pre", "main", "post", "timeout"];

  const processBlock = (blockKey: string) => {
    const stepsInBlock = blockSteps[blockKey];
    if (!stepsInBlock || stepsInBlock.length === 0) return;

    const blockLabel = `BLOCK '${blockKey.toUpperCase()}'`;

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

        const functionLabel = `FUNCTION: ${functionName.toUpperCase()}`;
        result.push({
          label: `${blockLabel} — ${functionLabel}`,
          steps: functionSteps.map((s) => ({
            stepNumber: s.stepNumber,
            displayText: stripFunctionContext(stripBlockContext(s.displayName)),
          })),
        });
      } else {
        // Collect consecutive standalone steps into one group
        const standaloneSteps: StepOption[] = [];
        while (idx < stepsInBlock.length && !stepsInBlock[idx].isFunction) {
          standaloneSteps.push({
            stepNumber: stepsInBlock[idx].stepNumber,
            displayText: stripBlockContext(stepsInBlock[idx].displayName),
          });
          idx += 1;
        }
        result.push({ label: blockLabel, steps: standaloneSteps });
      }
    }
  };

  for (const blockKey of blockOrder) {
    processBlock(blockKey);
  }

  for (const blockKey of Object.keys(blockSteps)) {
    if (!blockOrder.includes(blockKey)) {
      processBlock(blockKey);
    }
  }

  return result;
};
