import styled from "@emotion/styled";
import TaskStatusBadge from "@evg-ui/lib/components/Badge/TaskStatusBadge";
import { LGColumnDef } from "@evg-ui/lib/components/Table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import TaskStatusBadgeWithLink from "components/TaskStatusBadgeWithLink";
import { getTableMode } from "constants/featureFlags";
import { PrevRunPopover } from "./PrevRunPopover";
import { TaskTableInfo } from "./types";

export const getBaseTaskCell = (({
  getValue,
  row: {
    original: { baseTask },
  },
}) => {
  const baseTaskStatus = getValue() as TaskStatus;
  const isInProgress =
    baseTaskStatus !== TaskStatus.Succeeded &&
    baseTaskStatus !== TaskStatus.Failed;

  const tableMode = getTableMode();

  if (!baseTask) {
    return <TaskStatusBadge status={getValue() as TaskStatus} />;
  }

  if (isInProgress && baseTask?.prevTaskCompleted && tableMode === "inline") {
    return (
      <Container>
        <TaskStatusBadgeWithLink
          execution={baseTask?.execution}
          id={baseTask?.id}
          status={getValue() as TaskStatus}
        />
        <PrevRunPopover prevTaskCompleted={baseTask.prevTaskCompleted} />
      </Container>
    );
  }

  return (
    <TaskStatusBadgeWithLink
      execution={baseTask?.execution}
      id={baseTask?.id}
      status={getValue() as TaskStatus}
    />
  );
}) satisfies LGColumnDef<TaskTableInfo>["cell"];

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
