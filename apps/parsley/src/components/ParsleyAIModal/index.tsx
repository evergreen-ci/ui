import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant as BadgeVariant } from "@leafygreen-ui/badge";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "@evg-ui/lib/gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "@evg-ui/lib/gql/mutations";
import { getSpruceURL } from "@evg-ui/lib/utils/environmentVariables";
import { useAIAgentAnalytics } from "analytics";
import { SEEN_PARSLEY_AI_BETA_MODAL } from "constants/cookies";
import screenshot from "./screenshot.png";

interface ParsleyAIModalProps {
  open: boolean;
  setOpen(o: boolean): void;
}

export const ParsleyAIModal: React.FC<ParsleyAIModalProps> = ({
  open,
  setOpen,
}) => {
  const { sendEvent } = useAIAgentAnalytics();
  const dispatchToast = useToastContext();

  const handleClose = (enabledBeta: boolean) => () => {
    Cookies.set(SEEN_PARSLEY_AI_BETA_MODAL, "true", { expires: 365 });
    sendEvent({
      "beta_features.parsley_ai_enabled": enabledBeta,
      name: "Viewed Parsley AI beta modal",
    });
    setOpen(false);
  };

  const [updateBetaFeatures] = useMutation<
    UpdateUserBetaFeaturesMutation,
    UpdateUserBetaFeaturesMutationVariables
  >(UPDATE_USER_BETA_FEATURES, {
    onCompleted: () => {
      handleClose(true)();
    },
    onError: () => {
      handleClose(false)();
      dispatchToast.error(
        <span>
          Failed to enable Parsley AI beta. Visit your{" "}
          <StyledLink href={`${getSpruceURL()}/preferences`} target="__blank">
            UI Settings page
          </StyledLink>{" "}
          to update.
        </span>,
      );
    },
    refetchQueries: ["UserBetaFeatures"],
  });

  const handleEnableBeta = () => {
    updateBetaFeatures({
      variables: {
        opts: {
          betaFeatures: {
            parsleyAIEnabled: true,
          },
        },
      },
    });
  };

  return (
    <StyledModal
      buttonText="Enable it!"
      data-cy="parsley-ai-modal"
      graphic={<Image />}
      graphicStyle="center"
      linkText="Maybe later, continue without Parsley AI"
      onButtonClick={handleEnableBeta}
      onClose={handleClose(false)}
      onLinkClick={handleClose(false)}
      open={open}
      showBlob
      title={
        <Title>
          <span>Debug Failures with Parsley AI</span>
          <Badge variant={BadgeVariant.Blue}>Beta</Badge>
        </Title>
      }
    >
      <ModalContent>
        Join the beta to begin using Parsley AI today. You can always opt out
        via your{" "}
        <StyledLink href={`${getSpruceURL()}/preferences`} target="__blank">
          UI Settings on Spruce
        </StyledLink>
        .
      </ModalContent>
    </StyledModal>
  );
};

const Image: React.FC = () => (
  <img alt="Screenshot of new Parsley AI Agent" src={screenshot} />
);

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${size.xs};
`;

const StyledModal = styled(MarketingModal)`
  z-index: ${zIndex.modal};
  div img {
    max-width: 85%;
  }
`;

const ModalContent = styled.div`
  margin-top: ${size.s};
`;
