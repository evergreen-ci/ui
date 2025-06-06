import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip, { Align, Justify } from "@leafygreen-ui/tooltip";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { DropdownItem } from "components/ButtonDropdown";
import { VersionRestartModal } from "components/VersionRestartModal";

interface RestartPatchProps {
  patchId: string;
  disabled?: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  disabled = false,
  isButton,
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

  const message = isButton
    ? "This version cannot be restarted because it is from the GitHub merge queue."
    : "This patch cannot be restarted because it is either unconfigured or from the GitHub merge queue.";

  return (
    <>
      <Tooltip
        align={isButton ? Align.Top : Align.Left}
        enabled={disabled}
        justify={Justify.End}
        popoverZIndex={zIndex.tooltip}
        trigger={
          isButton ? (
            <Button
              data-cy="restart-version"
              disabled={disabled}
              onClick={onClick}
              size="small"
            >
              Restart
            </Button>
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
        triggerEvent="hover"
      >
        {disabled ? message : ""}
      </Tooltip>
      <VersionRestartModal
        onCancel={() => setIsVisible(false)}
        onOk={() => {
          setIsVisible(false);
        }}
        refetchQueries={refetchQueries}
        versionId={patchId}
        visible={isVisible}
      />
    </>
  );
};
