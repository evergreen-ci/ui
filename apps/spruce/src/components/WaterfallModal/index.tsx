import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useWaterfallAnalytics } from "analytics";
import { SEEN_WATERFALL_BETA_MODAL } from "constants/cookies";
import {
  PreferencesTabRoutes,
  getPreferencesRoute,
  getWaterfallRoute,
} from "constants/routes";
import {
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "gql/mutations";
import { useUserBetaFeatures } from "hooks/useBetaFeatures";
import screenshot from "./screenshot.png";

export const WaterfallModal: React.FC<{ projectIdentifier: string }> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const navigate = useNavigate();
  const { userBetaSettings } = useUserBetaFeatures();
  const dispatchToast = useToastContext();

  const handleClose = (enabledBeta: boolean) => () => {
    Cookies.set(SEEN_WATERFALL_BETA_MODAL, "true", { expires: 365 });
    sendEvent({
      name: "Viewed waterfall beta modal",
      "beta_features.spruce_waterfall_enabled": enabledBeta,
    });
    setOpen(false);
  };

  const [updateBetaFeatures] = useMutation<
    UpdateUserBetaFeaturesMutation,
    UpdateUserBetaFeaturesMutationVariables
  >(UPDATE_USER_BETA_FEATURES, {
    onCompleted: () => {
      handleClose(true)();
      navigate(getWaterfallRoute(projectIdentifier));
    },
    onError: () => {
      handleClose(false)();
      dispatchToast.error(
        "Failed to enable waterfall beta. Visit your UI Settings page to update.",
      );
    },
    refetchQueries: ["UserBetaFeatures"],
  });

  const [open, setOpen] = useState(true);

  const handleEnableBeta = () => {
    updateBetaFeatures({
      variables: {
        opts: {
          betaFeatures: {
            ...userBetaSettings,
            spruceWaterfallEnabled: true,
          },
        },
      },
    });
  };

  return (
    <StyledModal
      buttonText="Enable Beta"
      data-cy="waterfall-modal"
      graphic={<Image />}
      linkText="Maybe later, continue to Project Health"
      onButtonClick={handleEnableBeta}
      onClose={handleClose(false)}
      onLinkClick={handleClose(false)}
      open={open}
      showBlob
      title={
        <Title>
          <span>
            (<em>Re</em>)Introducing the Waterfall
          </span>
          <Badge variant={Variant.Blue}>Beta</Badge>
        </Title>
      }
    >
      Join the beta to begin using the waterfall on Spruce today. You can always
      opt out via your{" "}
      <StyledRouterLink
        to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}
      >
        UI Settings
      </StyledRouterLink>
      . The Project Health page will continue to be accessible via
      &ldquo;More&rdquo; in the navigation bar.
    </StyledModal>
  );
};

const Title = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${size.xs};
`;

const StyledModal = styled(MarketingModal)`
  z-index: 2;
  div img {
    max-width: 80%;
  }
`;

const Image: React.FC = () => (
  <img alt="Screenshot of the new grid-like waterfall page" src={screenshot} />
);
