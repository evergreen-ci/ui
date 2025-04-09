import { useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { SQUARE_BORDER, SQUARE_SIZE } from "components/TaskBox";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  TaskHistoryDirection,
  TaskHistoryQuery,
  TaskHistoryQueryVariables,
  TaskQuery,
} from "gql/generated/types";
import { TASK_HISTORY } from "gql/queries";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import CommitDetailsList from "./CommitDetailsList";
import { ACTIVATED_TASKS_LIMIT } from "./constants";
import TaskTimeline from "./TaskTimeline";
import { TaskHistoryOptions, ViewOptions } from "./types";
import { groupTasks } from "./utils";

interface TaskHistoryProps {
  task: NonNullable<TaskQuery["task"]>;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ task }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions<HTMLDivElement>(timelineRef);

  const dispatchToast = useToastContext();

  const [viewOption, setViewOption] = useState(ViewOptions.Collapsed);
  const shouldCollapse = viewOption === ViewOptions.Collapsed;

  const { buildVariant, displayName: taskName, project } = task;
  const { identifier: projectIdentifier = "" } = project ?? {};

  const [cursorId] = useQueryParam<string>(
    TaskHistoryOptions.CursorID,
    task.id,
  );
  const [direction] = useQueryParam<TaskHistoryDirection>(
    TaskHistoryOptions.Direction,
    TaskHistoryDirection.Before,
  );
  const [includeCursor] = useQueryParam<boolean>(
    TaskHistoryOptions.IncludeCursor,
    true,
  );

  const { data, loading } = useQuery<
    TaskHistoryQuery,
    TaskHistoryQueryVariables
  >(TASK_HISTORY, {
    variables: {
      options: {
        taskName,
        buildVariant,
        projectIdentifier,
        cursorParams: {
          cursorId,
          direction,
          includeCursor,
        },
        limit: ACTIVATED_TASKS_LIMIT,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(`Unable to get task history: ${err}`);
    },
  });

  const { taskHistory } = data ?? {};
  const { tasks = [] } = taskHistory ?? {};

  const groupedTasks = groupTasks(tasks, shouldCollapse);
  const numVisibleTasks = Math.floor(width / (SQUARE_SIZE + SQUARE_BORDER * 2));
  const visibleTasks = groupedTasks.slice(0, numVisibleTasks);

  return (
    <Container>
      <Header>
        <H3>Task History Overview</H3>
        <SegmentedControl
          onChange={(t) => setViewOption(t as ViewOptions)}
          size="xsmall"
          value={viewOption}
        >
          <SegmentedControlOption
            data-cy="collapsed-option"
            value={ViewOptions.Collapsed}
          >
            Collapsed
          </SegmentedControlOption>
          <SegmentedControlOption
            data-cy="expanded-option"
            value={ViewOptions.Expanded}
          >
            Expanded
          </SegmentedControlOption>
        </SegmentedControl>
      </Header>
      <TaskTimeline ref={timelineRef} loading={loading} tasks={visibleTasks} />
      <CommitDetailsList
        currentTask={task}
        loading={loading}
        tasks={visibleTasks}
      />
    </Container>
  );
};

export default TaskHistory;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};

  height: calc(100vh - 270px);
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
