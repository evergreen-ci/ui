import { Align, Justify, Tooltip } from "@leafygreen-ui/tooltip";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
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
    <DropdownItem
      data-testid="reconfigure-link"
      href={getPatchRoute(patchId, { configure: true })}
      isDisabled={disabled}
      onAction={() => {
        if (!disabled) {
          sendEvent({ name: "Clicked patch reconfigure link" });
        }
      }}
    >
      <Tooltip
        align={Align.Left}
        enabled={disabled}
        justify={Justify.End}
        trigger={<span>Reconfigure tasks/variants</span>}
        triggerEvent="hover"
      >
        {disabled
          ? "This is not a reconfigurable patch. Use the Schedule button instead to schedule tasks."
          : ""}
      </Tooltip>
    </DropdownItem>
  );
};
