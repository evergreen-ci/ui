import Checkbox from "@leafygreen-ui/checkbox";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { useVersionAnalytics } from "analytics/version/useVersionAnalytics";
import { INCLUDE_NEVER_ACTIVATED_TASKS } from "constants/cookies";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchTasksQueryParams } from "types/task";

interface IncludeAllTasksToggleProps {
  versionId: string;
}

export const IncludeAllTasksToggle: React.FC<IncludeAllTasksToggleProps> = ({
  versionId,
}) => {
  const versionAnalytics = useVersionAnalytics(versionId);

  const [includeNeverActivatedTasks, setIncludeNeverActivatedTasks] =
    useQueryParam(
      PatchTasksQueryParams.IncludeNeverActivatedTasks,
      Cookies.get(INCLUDE_NEVER_ACTIVATED_TASKS) === "true",
    );

  const handleIncludeNeverActivatedTasksChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIncludeNeverActivatedTasks(e.target.checked);
    versionAnalytics.sendEvent({
      name: "Toggled include never activated tasks",
      include_never_activated_tasks: e.target.checked,
    });
  };

  return (
    <MenuItem>
      <Checkbox
        checked={includeNeverActivatedTasks}
        darkMode
        data-cy="include-never-activated-tasks-checkbox"
        label={<Body weight="medium">Always include all tasks</Body>}
        onChange={handleIncludeNeverActivatedTasksChange}
      />
    </MenuItem>
  );
};
