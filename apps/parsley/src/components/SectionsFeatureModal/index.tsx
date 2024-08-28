import styled from "@emotion/styled";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import { useMatch } from "react-router-dom";
import { useSectionsFeatureDiscoveryAnalytics } from "analytics/sectionsFeatureDiscovery/useSectionsFeatureDiscoveryAnalytics";
import routes from "constants/routes";
import { zIndex } from "constants/tokens";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { useParsleySettings } from "hooks/useParsleySettings";
import { graphic } from "./graphic";

export const SectionsFeatureModal = () => {
  const { closeFeatureModal, isOpenFeatureModal } =
    useSectionsFeatureDiscoveryContext();
  const isViewingTaskLog = useMatch(routes.evergreenLogs);
  const { sendEvent } = useSectionsFeatureDiscoveryAnalytics();
  const { updateSettings } = useParsleySettings();

  return isViewingTaskLog ? (
    <StyledMarketingModal
      buttonText="Enable sectioning"
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
          name: "Clicked feature modal cancel button",
          release: "beta",
        });
      }}
      open={isOpenFeatureModal}
      showBlob
      title="Introducing Task Log Sectioning Beta Preview!"
    >
      <p>
        Parsley now supports sectioning for <b>task logs!</b> You can now group
        your task logs into sections to make them easier to navigate and
        understand.
      </p>
      <p>
        For feedback and questions go to{" "}
        <a href="https://mongodb.enterprise.slack.com/archives/C0V896UV8">
          #ask-devprod-evergreen
        </a>
        .
      </p>
    </StyledMarketingModal>
  ) : null;
};

const StyledMarketingModal = styled(MarketingModal)`
  z-index: ${zIndex.max_do_not_use};
`;
