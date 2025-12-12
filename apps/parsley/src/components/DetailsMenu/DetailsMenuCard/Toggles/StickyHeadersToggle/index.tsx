import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const StickyHeadersToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences, sectioning } = useLogContext();
  const { setStickyHeadersEnabled, stickyHeadersEnabled } = preferences;

  return (
    <BaseToggle
      data-cy="sticky-headers-toggle"
      disabled={!sectioning.sectioningEnabled}
      label="Sticky Headers"
      onChange={(value) => {
        setStickyHeadersEnabled(value);
        sendEvent({ name: "Toggled sticky headers", on: value });
      }}
      tooltip="Makes function & command headers sticky. Only available when sections are enabled."
      value={stickyHeadersEnabled}
    />
  );
};

export default StickyHeadersToggle;
