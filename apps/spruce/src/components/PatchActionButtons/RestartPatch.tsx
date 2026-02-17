import { useState } from "react";
import { SplitButton } from "@leafygreen-ui/split-button";
import { Tooltip, Align, Justify } from "@leafygreen-ui/tooltip";
import { DropdownItem } from "components/ButtonDropdown";
import { VersionRestartModal } from "components/VersionRestartModal";
import { RestartFailedTasks } from "./RestartFailedTasks";

interface RestartPatchProps {
  disabled?: boolean;
  isButton?: boolean;
  isMergeQueuePatch: boolean;
  patchId: string;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const RestartPatch: React.FC<RestartPatchProps> = ({
  disabled = false,
  isButton,
  isMergeQueuePatch,
  patchId,
  refetchQueries,
  visibilityControl,
}) => {
  const fallbackVisibilityControl = useState(false);
  const [isVisible, setIsVisible] =
    visibilityControl !== undefined
      ? visibilityControl
      : fallbackVisibilityControl;

  const onClick = () => setIsVisible(!isVisible);

  const message = isMergeQueuePatch
    ? "GitHub merge queue patches cannot be restarted."
    : "This patch cannot be restarted.";

  return (
    <>
      <Tooltip
        align={isButton ? Align.Top : Align.Left}
        enabled={disabled}
        justify={Justify.End}
        trigger={
          isButton ? (
            <SplitButton
              data-cy="restart-version"
              disabled={disabled}
              label="Restart"
              menuItems={[
                <RestartFailedTasks
                  key="restart-failed"
                  disabled={disabled}
                  patchId={patchId}
                  refetchQueries={refetchQueries}
                />,
              ]}
              onClick={onClick}
              size="small"
            />
          ) : (
            <span>
              <DropdownItem
                data-cy="restart-version"
                disabled={disabled}
                onClick={onClick}
              >
                Restart
              </DropdownItem>
            </span>
          )
        }
      >
        {message}
      </Tooltip>
      <VersionRestartModal
        onCancel={() => setIsVisible(false)}
        onOk={() => setIsVisible(false)}
        refetchQueries={refetchQueries}
        versionId={patchId}
        visible={isVisible}
      />
    </>
  );
};
