import { Checkbox } from "@leafygreen-ui/checkbox";
import { MenuItem, MenuSeparator } from "@leafygreen-ui/menu";
import Cookies from "js-cookie";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useVersionAnalytics } from "analytics/version/useVersionAnalytics";
import { INCLUDE_NEVER_ACTIVATED_TASKS } from "constants/cookies";
import { PatchTasksQueryParams } from "types/task";
import styles from "./IncludeNeverActivatedTasksToggle.module.css";

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
    <>
      <MenuSeparator />
      <div className={styles.sectionHeader} role="presentation">
        Settings
      </div>
      <MenuItem
        data-testid="include-never-activated-tasks"
        onClick={handleIncludeNeverActivatedTasksChange}
      >
        <Checkbox
          checked={includeNeverActivatedTasks}
          className={styles.checkbox}
          darkMode
          description="Include tasks that have never been activated."
          label="Include never-activated tasks"
        />
      </MenuItem>
    </>
  );
};
