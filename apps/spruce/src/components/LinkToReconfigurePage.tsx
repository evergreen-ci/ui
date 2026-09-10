import { Tooltip, TooltipRoot, TooltipTrigger } from "@via-ds/components/tooltip";
import { useNavigate } from "react-router-dom";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { getPatchRoute } from "constants/routes";

export const LinkToReconfigurePage: React.FC<{
  patchId: string;
  disabled?: boolean;
  hasVersion?: boolean;
}> = ({ disabled, hasVersion = true, patchId }) => {
  const navigate = useNavigate();
  const { sendEvent } = (hasVersion ? useVersionAnalytics : usePatchAnalytics)(
    patchId,
  );

  return (
    <TooltipRoot side="left" align="end" isDisabled={!disabled}>
      <TooltipTrigger>
        <span>
          <DropdownItem
            data-testid="reconfigure-link"
            isDisabled={disabled}
            onAction={() => {
              if (!disabled) {
                sendEvent({ name: "Clicked patch reconfigure link" });
                navigate(getPatchRoute(patchId, { configure: true }));
              }
            }}
          >
            Reconfigure tasks/variants
          </DropdownItem>
        </span>
      </TooltipTrigger>
      <Tooltip>
        {disabled
          ? "This is not a reconfigurable patch. Use the Schedule button instead to schedule tasks."
          : ""}
      </Tooltip>
    </TooltipRoot>
  );
};
