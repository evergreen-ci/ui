import { MenuItem } from "@leafygreen-ui/menu";
import { Tooltip } from "@leafygreen-ui/tooltip";
import Cookies from "js-cookie";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics/version/useVersionAnalytics";
import { INCLUDE_NEVER_ACTIVATED_TASKS } from "constants/cookies";
import { PatchTasksQueryParams } from "types/task";

interface IncludeNeverActivatedTasksToggleProps {
  versionId: string;
}

export const IncludeNeverActivatedTasksToggle: React.FC<
  IncludeNeverActivatedTasksToggleProps
> = ({ versionId }) => {
  const versionAnalytics = useVersionAnalytics(versionId);

  const [includeNeverActivatedTasks, setIncludeNeverActivatedTasks] =
    useQueryParam<boolean | undefined>(
      PatchTasksQueryParams.IncludeNeverActivatedTasks,
      Cookies.get(INCLUDE_NEVER_ACTIVATED_TASKS) === "true",
    );

  const handleIncludeNeverActivatedTasksChange = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    const checked = !includeNeverActivatedTasks;
    setIncludeNeverActivatedTasks(checked);
    Cookies.set(INCLUDE_NEVER_ACTIVATED_TASKS, checked.toString());
    versionAnalytics.sendEvent({
      name: "Toggled include never activated tasks",
      include_never_activated_tasks: checked,
    });
  };

  return (
    <Tooltip
      align="left"
      popoverZIndex={zIndex.tooltip}
      trigger={
        <MenuItem onClick={handleIncludeNeverActivatedTasksChange}>
          {includeNeverActivatedTasks
            ? "Exclude never-activated tasks"
            : "Include never-activated tasks"}
        </MenuItem>
      }
    >
      {includeNeverActivatedTasks
        ? "Hide tasks that exist in this version but have never been activated"
        : "Show tasks that exist in this version but have never been activated"}
    </Tooltip>
  );
};
