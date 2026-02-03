import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { StyledRouterLink } from "@evg-ui/lib/components";
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
import { setObject } from "utils/localStorage";
import { createInitialState } from "./state";
import { TaskTimingConfigMenu } from "./TaskTimingConfig";

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
  const [configState, setConfigState] = useState(createInitialState);

  useEffect(() => {
    // Update config in localStorage
    setObject(TASK_TIMING_CONFIG_KEY, configState);
  }, [configState]);

  const linkProps = (metric: TaskTimingMetric) => ({
    onClick: () =>
      sendEvent({
        name: "Clicked task timing link",
        metric,
        only_commits: configState.onlyCommits,
        only_successful: configState.onlySuccessful,
      }),
    to: getHoneycombTaskTimingURL({
      ...configState,
      buildVariant,
      metric,
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
          <TaskTimingConfigMenu
            configState={configState}
            setConfigState={setConfigState}
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
