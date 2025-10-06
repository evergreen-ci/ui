import { useState } from "react";
import styled from "@emotion/styled";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import MetadataCard, {
  MetadataCardTitle,
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import {
  getHoneycombTaskTimingURL,
  TaskTimingMetric,
} from "constants/externalResources/honeycomb";
import { TASK_TIMING_CONFIG_KEY } from "constants/index";
import { getObject, setObject } from "utils/localStorage";
import { TaskTimingConfig } from "./TaskTimingConfig";

interface TaskTimingProps {
  buildVariant: string;
  projectIdentifier: string;
  taskName: string;
}

export const TaskTimingMetadata: React.FC<TaskTimingProps> = ({
  buildVariant,
  projectIdentifier,
  taskName,
}) => {
  const { sendEvent } = useTaskAnalytics();
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

  const linkProps = (metric: TaskTimingMetric) => ({
    onClick: () =>
      sendEvent({
        name: "Clicked task timing link",
        metric,
        only_successful: onlySuccessful,
      }),
    to: getHoneycombTaskTimingURL({
      buildVariant,
      metric,
      onlySuccessful,
      projectIdentifier,
      taskName,
    }),
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
        <StyledRouterLink {...linkProps(TaskTimingMetric.TotalTime)}>
          Activated &rarr; Finish
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Wait Time:</MetadataLabel>{" "}
        <StyledRouterLink {...linkProps(TaskTimingMetric.WaitTime)}>
          Activated &rarr; Start
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Run Time:</MetadataLabel>{" "}
        <StyledRouterLink {...linkProps(TaskTimingMetric.RunTime)}>
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
