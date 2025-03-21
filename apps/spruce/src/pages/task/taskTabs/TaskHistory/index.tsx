interface TaskHistoryProps {
  taskId: string;
  execution: number;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ execution, taskId }) => (
  <div data-cy="task-history">
    This is the history for task {taskId} and execution {execution}
  </div>
);

export default TaskHistory;
