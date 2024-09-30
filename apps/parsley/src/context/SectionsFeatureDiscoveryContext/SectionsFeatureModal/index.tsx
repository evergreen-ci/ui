import styled from "@emotion/styled";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import { useSectionsFeatureDiscoveryAnalytics } from "analytics/sectionsFeatureDiscovery/useSectionsFeatureDiscoveryAnalytics";
import { LogTypes } from "constants/enums";
import { zIndex } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { useParsleySettings } from "hooks/useParsleySettings";
import { graphic } from "./graphic";

const SectionsFeatureModal = () => {
  const { closeFeatureModal, featureModalOpen } =
    useSectionsFeatureDiscoveryContext();
  const { logMetadata } = useLogContext();
  const isViewingTaskLog =
    logMetadata?.logType === LogTypes.EVERGREEN_TASK_LOGS;
  const { sendEvent } = useSectionsFeatureDiscoveryAnalytics();
  const { updateSettings } = useParsleySettings();

  return isViewingTaskLog ? (
    <StyledMarketingModal
      buttonText="Enable sectioning"
      data-cy="sections-feature-modal"
      graphic={graphic}
      graphicStyle="center"
      linkText=""
      onButtonClick={() => {
        closeFeatureModal();
        updateSettings({
          sectionsEnabled: true,
        });
        sendEvent({
          name: "Clicked feature modal enable sections buttons",
          release: "beta",
        });
      }}
      onClose={() => {
        closeFeatureModal();
        sendEvent({
          name: "Clicked sections feature modal cancel button",
          release: "beta",
        });
      }}
      open={featureModalOpen}
      showBlob
      title="Introducing Task Log Sectioning Beta Preview!"
    >
      <p>
        Parsley now supports sectioning for <b>task logs!</b> Evergreen
        organizes your logs by function and command to make them easier to
        navigate and understand.
      </p>
      <p>For feedback and questions go to #ask-devprod-evergreen.</p>
    </StyledMarketingModal>
  ) : null;
};

const StyledMarketingModal = styled(MarketingModal)`
  z-index: ${zIndex.max_do_not_use};
`;

export default SectionsFeatureModal;
