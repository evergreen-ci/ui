import { useState } from "react";
import styled from "@emotion/styled";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import MetadataCard, {
  MetadataCardTitle,
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import {
  getHoneycombTaskTimingURL,
  TaskTimingMetric,
} from "constants/externalResources";
import { TASK_TIMING_CONFIG_KEY } from "constants/index";
import { getObject, setObject } from "utils/localStorage";
import { TaskTimingConfig } from "./TaskTimingConfig";

interface TaskTimingProps {
  buildVariant: string;
  taskName: string;
}

export const TaskTimingMetadata: React.FC<TaskTimingProps> = ({
  buildVariant,
  taskName,
}) => {
  const taskTimingConfig = getObject(TASK_TIMING_CONFIG_KEY) ?? {};
  const [onlySuccessful, setOnlySuccessful] = useState(
    taskTimingConfig?.onlySuccessful ?? false,
  );

  const handleOnlySuccessfulChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSetting: boolean = e.target.checked;
    setOnlySuccessful(newSetting);
    setObject(TASK_TIMING_CONFIG_KEY, {
      ...taskTimingConfig,
      onlySuccessful: newSetting,
    });
  };

  const linkDestination = (metric: TaskTimingMetric) =>
    getHoneycombTaskTimingURL({
      buildVariant,
      metric,
      onlySuccessful,
      taskName,
    });

  return (
    <MetadataCard
      title={
        <CardHeader>
          <MetadataCardTitle weight="medium">
            Historical Task Timing
          </MetadataCardTitle>
          <TaskTimingConfig
            handleOnlySuccessfulChange={handleOnlySuccessfulChange}
            onlySuccessful={onlySuccessful}
          />
        </CardHeader>
      }
    >
      <MetadataItem>
        <MetadataLabel>Total Time:</MetadataLabel>{" "}
        <StyledRouterLink to={linkDestination(TaskTimingMetric.TotalTime)}>
          Activated &rarr; Finish
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Wait Time:</MetadataLabel>{" "}
        <StyledRouterLink to={linkDestination(TaskTimingMetric.WaitTime)}>
          Activated &rarr; Start
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Run Time:</MetadataLabel>{" "}
        <StyledRouterLink to={linkDestination(TaskTimingMetric.RunTime)}>
          Start &rarr; Finish
        </StyledRouterLink>
      </MetadataItem>
    </MetadataCard>
  );
};

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
