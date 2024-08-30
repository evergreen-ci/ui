import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { size } from "constants/tokens";
import { DistroQuery } from "gql/generated/types";
import { SaveModal } from "../../SaveModal";
import { WritableDistroSettingsTabs } from "../types";

type UnsavedModalProps = {
  distro: DistroQuery["distro"];
  shouldBlock: boolean | BlockerFunction;
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const UnsavedModal: React.FC<UnsavedModalProps> = ({
  distro,
  shouldBlock,
}) => {
  const blocker = useBlocker(shouldBlock);

  return (
    blocker.state === "blocked" && (
      <SaveModal
        banner={
          <StyledBanner data-cy="provider-warning-banner" variant="warning">
            Your distro provider changes must be saved or reverted before
            navigating to a new page.
          </StyledBanner>
        }
        distro={distro}
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
        open
        tab={WritableDistroSettingsTabs.Provider}
      />
    )
  );
};

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.xs};
`;
