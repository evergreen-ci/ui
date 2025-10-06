import { useState } from "react";
import Button, { Size as ButtonSize } from "@leafygreen-ui/button";
import Tooltip, { Align, Justify } from "@leafygreen-ui/tooltip";
import { DropdownItem } from "components/ButtonDropdown";
import { VersionRestartModal } from "components/VersionRestartModal";

interface RestartPatchProps {
  disabled?: boolean;
  isButton?: boolean;
  isMergeQueuePatch: boolean;
  patchId: string;
  refetchQueries: string[];
}

export const RestartPatch: React.FC<RestartPatchProps> = ({
  disabled = false,
  isButton,
  isMergeQueuePatch,
  patchId,
  refetchQueries,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onClick = () => setIsVisible((v) => !v);

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
            <Button
              data-cy="restart-version"
              disabled={disabled}
              onClick={onClick}
              size={ButtonSize.Small}
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
