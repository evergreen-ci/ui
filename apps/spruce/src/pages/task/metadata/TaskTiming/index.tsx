import { useState } from "react";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import MetadataCard, { MetadataItem } from "components/MetadataCard";
import {
  getHoneycombTaskTimingURL,
  TaskTimingMetric,
} from "constants/externalResources";
import { TaskTimingConfig } from "./TaskTimingConfig";

interface TaskTimingProps {
  buildVariant: string;
  taskName: string;
}

export const TaskTimingMetadata: React.FC<TaskTimingProps> = ({
  buildVariant,
  taskName,
}) => {
  const [onlySuccessful, setOnlySuccessful] = useState(false);
  console.log(onlySuccessful, setOnlySuccessful);
  return (
    <MetadataCard headerContent={<TaskTimingConfig />} title="Task Timing">
      <MetadataItem>Run Time</MetadataItem>
      <MetadataItem>
        <StyledRouterLink
          arrowAppearance="hover"
          to={getHoneycombTaskTimingURL({
            buildVariant,
            metric: TaskTimingMetric.WaitTime,
            taskName,
          })}
        >
          Wait Time
        </StyledRouterLink>
      </MetadataItem>
      <MetadataItem>Total Time</MetadataItem>
    </MetadataCard>
  );
};
