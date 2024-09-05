import { useState } from "react";
import Button from "@leafygreen-ui/button";
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

  return (
    <>
      {isButton ? (
        <Button
          data-cy="restart-version"
          disabled={disabled}
          onClick={onClick}
          size="small"
        >
          Restart
        </Button>
      ) : (
        <DropdownItem
          data-cy="restart-version"
          disabled={disabled}
          onClick={onClick}
        >
          Restart
        </DropdownItem>
      )}
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
