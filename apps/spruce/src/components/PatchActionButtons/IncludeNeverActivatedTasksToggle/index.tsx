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
  const { sendEvent } = useVersionAnalytics(versionId);

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
    sendEvent({
      name: "Toggled include never activated tasks",
      include_never_activated_tasks: checked,
    });
  };

  return (
    <>
      <MenuSeparator />
      {/* MenuGroup is not used because it does not inherit the dark mode styles correctly; this should be addressed when migrating the component to Via.*/}
      <div className={styles.sectionHeader} role="presentation">
        Settings
      </div>
      <MenuItem
        data-testid="include-never-activated-tasks"
        onClick={handleIncludeNeverActivatedTasksChange}
      >
        <Checkbox
          checked={includeNeverActivatedTasks}
          darkMode
          description="Show tasks that exist in this version but have never been activated."
          label="Include never-activated tasks"
        />
      </MenuItem>
    </>
  );
};
