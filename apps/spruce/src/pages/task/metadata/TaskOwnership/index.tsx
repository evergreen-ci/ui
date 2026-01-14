import React from "react";
import { useQuery } from "@apollo/client/react";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import {
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables,
} from "gql/generated/types";
import { TASK_OWNER_TEAM } from "gql/queries";

interface TaskOwnershipProps {
  taskId: string;
  execution?: number;
}
const TaskOwnership: React.FC<TaskOwnershipProps> = ({ execution, taskId }) => {
  const { data } = useQuery<
    TaskOwnerTeamsForTaskQuery,
    TaskOwnerTeamsForTaskQueryVariables
  >(TASK_OWNER_TEAM, {
    variables: {
      taskId,
      execution,
    },
  });
  if (!data) return null;
  const { task } = data ?? {};
  const { taskOwnerTeam } = task || {};
  const { messages, teamName } = taskOwnerTeam || {};
  return (
    <MetadataItem
      data-cy="task-metadata-task-ownership"
      tooltipDescription={messages}
    >
      <MetadataLabel>Task Owner: </MetadataLabel>
      {teamName || "No known team"}
    </MetadataItem>
  );
};

export default TaskOwnership;
