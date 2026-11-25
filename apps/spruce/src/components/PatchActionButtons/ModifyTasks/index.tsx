import { Button, Menu, MenuPopover, MenuRoot } from "@via-ds/components";
import CaretDown from "@via-ds/icons/CaretDown";
import { useTaskSelectionContext } from "pages/version/TaskSelection";
import { ScheduleTasks } from "./ScheduleTasks";

interface ModifyTasksProps {
  versionId: string;
}

export const ModifyTasks: React.FC<ModifyTasksProps> = ({ versionId }) => {
  const { clearSelection, selectedCount, taskSelection } =
    useTaskSelectionContext();

  return (
    <MenuRoot>
      <Button data-testid="modify-tasks" isDisabled={selectedCount === 0}>
        Modify tasks{selectedCount > 0 && ` (${selectedCount})`}
        <CaretDown />
      </Button>
      <MenuPopover>
        <Menu aria-label="Modify tasks">
          <ScheduleTasks
            clearSelection={clearSelection}
            taskSelection={taskSelection}
            versionId={versionId}
          />
        </Menu>
      </MenuPopover>
    </MenuRoot>
  );
};
