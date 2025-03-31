import { useState } from "react";
import styled from "@emotion/styled";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { SEEN_WATERFALL_LAUNCH_MODAL } from "constants/cookies";
import { getWaterfallRoute } from "constants/routes";
import screenshot from "./screenshot.png";

export const WaterfallModal: React.FC<{ projectIdentifier: string }> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const navigate = useNavigate();

  const handleClose = (goToWaterfall: boolean) => () => {
    Cookies.set(SEEN_WATERFALL_LAUNCH_MODAL, "true", { expires: 365 });
    sendEvent({
      name: "Viewed waterfall modal",
      navigated_to_waterfall: goToWaterfall,
    });
    setOpen(false);
    if (goToWaterfall) {
      navigate(getWaterfallRoute(projectIdentifier));
    }
  };

  const [open, setOpen] = useState(true);

  return (
    <StyledModal
      buttonText="Visit Waterfall"
      data-cy="waterfall-modal"
      graphic={<Image />}
      linkText="Continue to Project Health"
      onButtonClick={handleClose(true)}
      onClose={handleClose(false)}
      onLinkClick={handleClose(false)}
      open={open}
      showBlob
      title={
        <Title>
          <span>
            (<em>Re</em>)Introducing the Waterfall
          </span>
        </Title>
      }
    >
      The new Spruce Waterfall replaces the Project Health page for increased
      information density and performance. The Project Health page will continue
      to be accessible for a limited time via &ldquo;More&rdquo; in the
      navigation bar.
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
