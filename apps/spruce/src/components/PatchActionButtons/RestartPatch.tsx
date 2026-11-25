import { useState } from "react";
import { SplitButton } from "@leafygreen-ui/split-button";
import { Align, Justify, Tooltip } from "@leafygreen-ui/tooltip";
import { VersionRestartModal } from "components/VersionRestartModal";
import { RestartFailedTasks } from "./RestartFailedTasks";

interface RestartPatchProps {
  disabled?: boolean;
  isMergeQueuePatch: boolean;
  patchId: string;
  refetchQueries: string[];
}

export const RestartPatch: React.FC<RestartPatchProps> = ({
  disabled = false,
  isMergeQueuePatch,
  patchId,
  refetchQueries,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onClick = () => setIsVisible(!isVisible);

  const message = isMergeQueuePatch
    ? "GitHub merge queue patches cannot be restarted."
    : "This patch cannot be restarted.";

  return (
    <>
      <Tooltip
        align={Align.Top}
        enabled={disabled}
        justify={Justify.End}
        trigger={
          <SplitButton
            data-testid="restart-version"
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
