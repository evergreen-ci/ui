import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useVersionAnalytics, usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { getPatchRoute } from "constants/routes";

export const LinkToReconfigurePage: React.FC<{
  patchId: string;
  disabled?: boolean;
  hasVersion?: boolean;
}> = ({ disabled, hasVersion = true, patchId }) => {
  const { sendEvent } = (hasVersion ? useVersionAnalytics : usePatchAnalytics)(
    patchId,
  );

  return (
    <Tooltip
      enabled={disabled}
      justify="end"
      popoverZIndex={zIndex.tooltip}
      trigger={
        <DropdownItem
          as={Link}
          data-cy="reconfigure-link"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              sendEvent({ name: "Clicked patch reconfigure link" });
            }
          }}
          to={getPatchRoute(patchId, { configure: true })}
        >
          Reconfigure tasks/variants
        </DropdownItem>
      }
      triggerEvent="hover"
    >
      {disabled
        ? "This is not a reconfigurable patch. Use the Schedule button instead to schedule tasks."
        : ""}
    </Tooltip>
  );
};
