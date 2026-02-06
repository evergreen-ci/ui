import styled from "@emotion/styled";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { FocusableMenuItem } from "@leafygreen-ui/menu";
import { useWaterfallAnalytics } from "analytics";
import { OMIT_INACTIVE_WATERFALL_BUILDS } from "constants/cookies";

interface OmitInactiveBuildsProps {
  omitInactiveBuilds: boolean;
  setOmitInactiveBuilds: (value: boolean) => void;
}

export const OmitInactiveBuilds: React.FC<OmitInactiveBuildsProps> = ({
  omitInactiveBuilds,
  setOmitInactiveBuilds,
}) => {
  const { sendEvent } = useWaterfallAnalytics();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setOmitInactiveBuilds(newValue);
    localStorage.setItem(OMIT_INACTIVE_WATERFALL_BUILDS, newValue.toString());
    sendEvent({ name: "Toggled omit inactive builds", enabled: newValue });
  };

  return (
    <StyledFocusableMenuItem>
      <StyledCheckbox
        checked={omitInactiveBuilds}
        data-cy="omit-inactive-builds-checkbox"
        description="When filtering, omit build variants with 0 activated tasks."
        label="Omit inactive builds"
        onChange={handleChange}
      />
    </StyledFocusableMenuItem>
  );
};

const StyledFocusableMenuItem = styled(FocusableMenuItem)`
  padding-left: 14px;
  padding-right: 14px;
`;

const StyledCheckbox = styled(Checkbox)`
  label > span {
    font-weight: 500;
  }
`;
