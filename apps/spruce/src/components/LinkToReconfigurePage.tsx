import { Link } from "react-router-dom";
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
  );
};
