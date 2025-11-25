import { useState } from "react";
import styled from "@emotion/styled";
import { MarketingModal } from "@leafygreen-ui/marketing-modal";
import Cookies from "js-cookie";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useSectionsFeatureDiscoveryAnalytics } from "analytics";
import { HAS_SEEN_SECTIONS_PROD_FEATURE_MODAL } from "constants/cookies";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { graphic } from "./graphic";

const SectionsFeatureModal = () => {
  const { logMetadata } = useLogContext();
  const isViewingTaskLog =
    logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;
  const { sendEvent } = useSectionsFeatureDiscoveryAnalytics();
  const [isOpen, setIsOpen] = useState(
    Cookies.get(HAS_SEEN_SECTIONS_PROD_FEATURE_MODAL) !== "true",
  );

  const closeModal = () => {
    setIsOpen(false);
    Cookies.set(HAS_SEEN_SECTIONS_PROD_FEATURE_MODAL, "true", { expires: 365 });
  };

  return isViewingTaskLog ? (
    <StyledMarketingModal
      buttonProps={{
        children: "Let's go!",
        onClick: () => {
          closeModal();
          sendEvent({
            name: "Clicked feature modal confirm button",
            release: "prod",
          });
        },
      }}
      data-cy="sections-feature-modal"
      graphic={graphic}
      graphicStyle="center"
      linkText=""
      onClose={() => {
        closeModal();
        sendEvent({
          name: "Clicked sections feature modal cancel button",
          release: "prod",
        });
      }}
      open={isOpen}
      showBlob
      title="Introducing Task Log Sectioning Official Release!"
    >
      <p>
        Parsley now officially supports sectioning for <b>task logs!</b> This
        feature has been automatically enabled and can be disabled at any time
        in the Details menu.
      </p>
      <p>For feedback and questions go to #ask-devprod-evergreen.</p>
    </StyledMarketingModal>
  ) : null;
};

const StyledMarketingModal = styled(MarketingModal)`
  z-index: ${zIndex.max_do_not_use};
`;

export default SectionsFeatureModal;
