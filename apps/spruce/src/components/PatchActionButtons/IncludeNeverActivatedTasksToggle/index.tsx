import {
  Checkbox,
  Header,
  MenuItem,
  MenuSection,
  Text,
} from "@via-ds/components";
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

  const handleAction = () => {
    const checked = !includeNeverActivatedTasks;
    setIncludeNeverActivatedTasks(checked);
    Cookies.set(INCLUDE_NEVER_ACTIVATED_TASKS, checked.toString());
    sendEvent({
      name: "Toggled include never activated tasks",
      include_never_activated_tasks: checked,
    });
  };

  return (
    <MenuSection>
      <Header>
        <Text slot="heading">Settings</Text>
      </Header>
      <MenuItem
        data-testid="include-never-activated-tasks"
        onAction={handleAction}
        shouldCloseOnSelect={false}
        textValue="Include never-activated tasks"
      >
        <Checkbox
          className={styles.checkbox}
          excludeFromTabOrder
          isSelected={!!includeNeverActivatedTasks}
        >
          Include never-activated tasks
        </Checkbox>
        <Text slot="description">
          Show tasks that exist in this version but have never been activated.
        </Text>
      </MenuItem>
    </MenuSection>
  );
};
